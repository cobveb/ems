package pl.viola.ems.model.modules.coordinator.publicProcurement.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.http.HttpStatus;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.plans.CoordinatorPlan;
import pl.viola.ems.model.modules.coordinator.plans.PublicProcurementPosition;
import pl.viola.ems.model.modules.coordinator.publicProcurement.Application;
import pl.viola.ems.model.modules.coordinator.publicProcurement.repository.PublicProcurementApplicationCustomRepository;
import pl.viola.ems.payload.modules.coordinator.application.ApplicationPayload;
import pl.viola.ems.service.modules.administrator.OrganizationUnitService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

public class PublicProcurementApplicationCustomRepositoryImpl implements PublicProcurementApplicationCustomRepository {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    OrganizationUnitService organizationUnitService;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);

    @Override
    public Page<ApplicationPayload> findApplicationsPageable(final List<OrganizationUnit> coordinators, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<Application> query = criteriaBuilder.createQuery(Application.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Application> criteriaRoot = query.from(Application.class);
        criteriaRoot.join("orderedObject", JoinType.LEFT);

        Root<Application> criteriaRootCount = count.from(Application.class);
        criteriaRootCount.join("orderedObject", JoinType.LEFT);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();
        List<ApplicationPayload> results = new ArrayList<>();

        if (!coordinators.isEmpty()) {
            predicates.add(criteriaRoot.get("coordinator").in(coordinators));
            predicatesCount.add(criteriaRootCount.get("coordinator").in(coordinators));
        }

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getName().equals("orderedObject")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getName().equals("mode")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("status")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("estimationType")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("year")) {
                        if (Integer.parseInt(cond.getValue()) == 0) {
                            LocalDate curYear = LocalDate.of(2020, Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("createDate"), firstDay));
                            predicatesCount.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRootCount.get("createDate"), firstDay));
                        } else {
                            LocalDate curYear = LocalDate.of(Integer.parseInt(cond.getValue()), Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
                            predicates.add(criteriaBuilder.between(criteriaRoot.get("createDate"), firstDay, lastDay));
                            predicatesCount.add(criteriaBuilder.between(criteriaRootCount.get("createDate"), firstDay, lastDay));
                        }
                    }
                }
            });
        }

        if (order != null) {
            Sort sort = new Sort(order.getDirection(), order.getProperty().substring(0,
                    order.getProperty().lastIndexOf(".") != -1 ? order.getProperty().lastIndexOf(".") : order.getProperty().length()
            ));
            query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
        }

        query.where(predicates.toArray(new Predicate[0]));

        TypedQuery<Application> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(application -> {
            ApplicationPayload applicationPayload = new ApplicationPayload(
                    application.getId(),
                    application.getCode(),
                    application.getNumber(),
                    application.getOrderedObject().getContent(),
                    application.getOrderedObject().getContent(),
                    application.getEstimationType(),
                    application.getMode(),
                    application.getOrderValueNet(),
                    application.getStatus(),
                    application.getCoordinator(),
                    application.getCreateDate(),
                    application.getSendDate(),
                    application.getIsPublicRealization()
            );
            results.add(applicationPayload);
        });

        if (order != null && order.getProperty().equals("orderedObject")) {
            if (order.getDirection().isAscending()) {
                results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase));
            } else {
                results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase).reversed());
            }
        }

        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }

    @Override
    public Page<ApplicationPayload> findApplicationsPageableByAccessLevel(final List<Application.ApplicationStatus> statuses, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<Application> query = criteriaBuilder.createQuery(Application.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Application> criteriaRoot = query.from(Application.class);
        criteriaRoot.join("orderedObject", JoinType.LEFT);

        Root<Application> criteriaRootCount = count.from(Application.class);
        criteriaRootCount.join("orderedObject", JoinType.LEFT);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();
        List<ApplicationPayload> results = new ArrayList<>();




        if (!conditions.isEmpty()) {
            final AtomicBoolean isStatusCondition = new AtomicBoolean(false);
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getName().equals("orderedObject")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getName().equals("mode")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("coordinator")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("code"), cond.getValue()));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()).get("code"), cond.getValue()));
                    } else if (cond.getName().equals("status")) {
                        if (!statuses.contains(Application.ApplicationStatus.valueOf(cond.getValue()))) {
                            throw new AppException(HttpStatus.BAD_REQUEST, "PublicProcurement.application.invalidStatus");
                        }
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        isStatusCondition.set(true);
                    } else if (cond.getName().equals("estimationType")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("year")) {
                        if (Integer.parseInt(cond.getValue()) == 0) {
                            LocalDate curYear = LocalDate.of(2020, Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("createDate"), firstDay));
                            predicatesCount.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRootCount.get("createDate"), firstDay));
                        } else {
                            LocalDate curYear = LocalDate.of(Integer.parseInt(cond.getValue()), Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
                            predicates.add(criteriaBuilder.between(criteriaRoot.get("createDate"), firstDay, lastDay));
                            predicatesCount.add(criteriaBuilder.between(criteriaRootCount.get("createDate"), firstDay, lastDay));
                        }
                    } else if (cond.getName().equals("sendFrom")) {
                        LocalDateTime sendFrom = LocalDateTime.parse(cond.getValue(), formatter);
                        Date sendFromDate = Date.from(sendFrom.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sendDate"), sendFromDate));
                        predicatesCount.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sendDate"), sendFromDate));

                    } else if (cond.getName().equals("sendTo")) {
                        LocalDateTime sendTo = LocalDateTime.parse(cond.getValue(), formatter);
                        Date sendToDate = Date.from(sendTo.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sendDate"), sendToDate));
                        predicatesCount.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sendDate"), sendToDate));
                    }
                }
            });
            if (!isStatusCondition.get()) {
                predicates.add(criteriaRoot.get("status").in(statuses));
                predicatesCount.add(criteriaRootCount.get("status").in(statuses));
            }
        } else {
            predicates.add(criteriaRoot.get("status").in(statuses));
            predicatesCount.add(criteriaRootCount.get("status").in(statuses));
        }

        if (order != null) {
            Sort sort = new Sort(order.getDirection(), order.getProperty().substring(0,
                    order.getProperty().lastIndexOf(".") != -1 ? order.getProperty().lastIndexOf(".") : order.getProperty().length()
            ));
            query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
        }

        query.where(predicates.toArray(new Predicate[0]));

        TypedQuery<Application> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(application -> {
            ApplicationPayload applicationPayload = new ApplicationPayload(
                    application.getId(),
                    application.getCode(),
                    application.getNumber(),
                    application.getOrderedObject().getContent(),
                    application.getOrderedObject().getContent(),
                    application.getEstimationType(),
                    application.getMode(),
                    application.getOrderValueNet(),
                    application.getStatus(),
                    application.getCoordinator(),
                    application.getCreateDate(),
                    application.getSendDate(),
                    application.getIsPublicRealization()
            );
            results.add(applicationPayload);
        });

        if (order != null && order.getProperty().equals("orderedObject")) {
            if (order.getDirection().isAscending()) {
                results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase));
            } else {
                results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase).reversed());
            }
        }

        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }

    @Override
    public Page<ApplicationPayload> findApplicationsPageableByDirector(final List<Application.ApplicationStatus> statuses, final Set<OrganizationUnit> coordinators, final String role, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<Application> query = criteriaBuilder.createQuery(Application.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Application> criteriaRoot = query.from(Application.class);
        criteriaRoot.join("orderedObject", JoinType.LEFT);

        Root<Application> criteriaRootCount = count.from(Application.class);
        criteriaRootCount.join("orderedObject", JoinType.LEFT);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> medPredicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();
        List<ApplicationPayload> results = new ArrayList<>();
        final AtomicBoolean isCoordinatorCondition = new AtomicBoolean(false);
        final AtomicBoolean isValidCoordinatorCondition = new AtomicBoolean(true);

        if (!conditions.isEmpty()) {
            final AtomicBoolean isStatusCondition = new AtomicBoolean(false);
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getName().equals("orderedObject")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                        medPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                        medPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getName().equals("mode")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                        medPredicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationMode.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("coordinator")) {
                        if (!Arrays.asList("DIRECTOR", "MED").contains(role) && cond.getValue().equals("dam")) {
                            predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("code"), cond.getValue()));
                            predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()).get("code"), cond.getValue()));
                        } else if (role.equals("DIRECTOR") && coordinators.stream().noneMatch(coordinator -> coordinator.getCode().equals(cond.getValue()))) {
                            isValidCoordinatorCondition.set(false);
                        } else {
                            predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("code"), cond.getValue()));
                            predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()).get("code"), cond.getValue()));
                        }
                        isCoordinatorCondition.set(true);
                    } else if (cond.getName().equals("status")) {
                        if (!statuses.contains(Application.ApplicationStatus.valueOf(cond.getValue()))) {
                            throw new AppException(HttpStatus.BAD_REQUEST, "PublicProcurement.application.invalidStatus");
                        }
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        medPredicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), Application.ApplicationStatus.valueOf(cond.getValue())));
                        isStatusCondition.set(true);
                    } else if (cond.getName().equals("estimationType")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                        medPredicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                        predicatesCount.add(criteriaBuilder.equal(criteriaRootCount.get(cond.getName()), PublicProcurementPosition.EstimationType.valueOf(cond.getValue())));
                    } else if (cond.getName().equals("year")) {
                        if (Integer.parseInt(cond.getValue()) == 0) {
                            LocalDate curYear = LocalDate.of(2020, Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("createDate"), firstDay));
                            medPredicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("createDate"), firstDay));
                            predicatesCount.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRootCount.get("createDate"), firstDay));
                        } else {
                            LocalDate curYear = LocalDate.of(Integer.parseInt(cond.getValue()), Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
                            predicates.add(criteriaBuilder.between(criteriaRoot.get("createDate"), firstDay, lastDay));
                            medPredicates.add(criteriaBuilder.between(criteriaRoot.get("createDate"), firstDay, lastDay));
                            predicatesCount.add(criteriaBuilder.between(criteriaRootCount.get("createDate"), firstDay, lastDay));
                        }
                    } else if (cond.getName().equals("sendFrom")) {
                        LocalDateTime sendFrom = LocalDateTime.parse(cond.getValue(), formatter);
                        Date sendFromDate = Date.from(sendFrom.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sendDate"), sendFromDate));
                        medPredicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sendDate"), sendFromDate));
                        predicatesCount.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sendDate"), sendFromDate));

                    } else if (cond.getName().equals("sendTo")) {
                        LocalDateTime sendTo = LocalDateTime.parse(cond.getValue(), formatter);
                        Date sendToDate = Date.from(sendTo.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sendDate"), sendToDate));
                        medPredicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sendDate"), sendToDate));
                        predicatesCount.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sendDate"), sendToDate));
                    }
                }
            });
            if (!isStatusCondition.get()) {
                predicates.add(criteriaRoot.get("status").in(statuses));
                medPredicates.add(criteriaRoot.get("status").in(statuses));
                predicatesCount.add(criteriaRootCount.get("status").in(statuses));
            }

            if (!isCoordinatorCondition.get() && Arrays.asList("DIRECTOR", "MED").contains(role) && !coordinators.isEmpty()) {
                predicates.add(criteriaRoot.get("coordinator").in(coordinators));
                predicatesCount.add(criteriaRootCount.get("coordinator").in(coordinators));
            }

        } else {
            predicates.add(criteriaRoot.get("status").in(statuses));
            medPredicates.add(criteriaRoot.get("status").in(statuses));
            predicatesCount.add(criteriaRootCount.get("status").in(statuses));

            if (Arrays.asList("DIRECTOR", "MED").contains(role) && !coordinators.isEmpty()) {
                predicates.add(criteriaRoot.get("coordinator").in(coordinators));
                predicatesCount.add(criteriaRootCount.get("coordinator").in(coordinators));
            }
        }

        if (isValidCoordinatorCondition.get()) {
            if (role.equals("MED")) {
                OrganizationUnit dam = organizationUnitService.findById("dam").orElse(null);
                if (!isCoordinatorCondition.get()) {

                    if (dam != null) {
                        Predicate med = criteriaBuilder.and(criteriaBuilder.and(medPredicates.toArray(new Predicate[0])), criteriaBuilder.and(criteriaBuilder.equal(criteriaRoot.get("orderIncludedPlanType"), CoordinatorPlan.PlanType.INW), criteriaBuilder.equal(criteriaRoot.get("coordinator"), dam)));
                        Predicate medCount = criteriaBuilder.and(criteriaBuilder.and(medPredicates.toArray(new Predicate[0])), criteriaBuilder.and(criteriaBuilder.equal(criteriaRootCount.get("orderIncludedPlanType"), CoordinatorPlan.PlanType.INW), criteriaBuilder.equal(criteriaRootCount.get("coordinator"), dam)));
                        Predicate medPredicate = criteriaBuilder.or(criteriaBuilder.and(predicates.toArray(new Predicate[0])), med);
                        Predicate medPredicateCount = criteriaBuilder.or(criteriaBuilder.and(predicatesCount.toArray(new Predicate[0])), medCount);

                        query.where(medPredicate);
                        count.select(criteriaBuilder.count(criteriaRootCount)).where(medPredicateCount);
                    }
                } else {

                    if (Objects.requireNonNull(conditions.stream().filter(searchCondition -> searchCondition.getName().equals("coordinator")).findAny().orElse(null)).getValue().equals("dam")) {
                        predicates.add(criteriaBuilder.and(criteriaBuilder.equal(criteriaRoot.get("orderIncludedPlanType"), CoordinatorPlan.PlanType.INW), criteriaBuilder.equal(criteriaRoot.get("coordinator"), dam)));
                        predicatesCount.add(criteriaBuilder.and(criteriaBuilder.equal(criteriaRootCount.get("orderIncludedPlanType"), CoordinatorPlan.PlanType.INW), criteriaBuilder.equal(criteriaRootCount.get("coordinator"), dam)));

                    } else {
                        predicates.add(criteriaRoot.get("coordinator").in(coordinators));
                        predicatesCount.add(criteriaRootCount.get("coordinator").in(coordinators));
                    }
                    query.where(predicates.toArray(new Predicate[0]));
                    count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));
                }
            }

            if (order != null) {
                Sort sort = new Sort(order.getDirection(), order.getProperty().substring(0,
                        order.getProperty().lastIndexOf(".") != -1 ? order.getProperty().lastIndexOf(".") : order.getProperty().length()
                ));
                query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
            }

            if (!role.equals("MED")) {
                query.where(predicates.toArray(new Predicate[0]));
                count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));
            }

            TypedQuery<Application> typedQuery = entityManager.createQuery(query);
            if (!isExport) {
                typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
                typedQuery.setMaxResults(pageable.getPageSize());
            }

            typedQuery.getResultList().forEach(application -> {
                ApplicationPayload applicationPayload = new ApplicationPayload(
                        application.getId(),
                        application.getCode(),
                        application.getNumber(),
                        application.getOrderedObject().getContent(),
                        application.getOrderedObject().getContent(),
                        application.getEstimationType(),
                        application.getMode(),
                        application.getOrderValueNet(),
                        application.getStatus(),
                        application.getCoordinator(),
                        application.getCreateDate(),
                        application.getSendDate(),
                        application.getIsPublicRealization()
                );
                results.add(applicationPayload);
            });

            if (order != null && order.getProperty().equals("orderedObject")) {
                if (order.getDirection().isAscending()) {
                    results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase));
                } else {
                    results.sort(Comparator.comparing(ApplicationPayload::getOrderedObject, String::compareToIgnoreCase).reversed());
                }
            }

            return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
        } else {
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }
    }
}

