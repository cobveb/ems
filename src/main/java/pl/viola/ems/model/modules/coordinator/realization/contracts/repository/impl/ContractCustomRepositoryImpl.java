package pl.viola.ems.model.modules.coordinator.realization.contracts.repository.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.contracts.Contract;
import pl.viola.ems.model.modules.coordinator.realization.contracts.repository.ContractCustomRepository;
import pl.viola.ems.payload.modules.coordinator.realization.contract.ContractPayload;

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

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

public class ContractCustomRepositoryImpl implements ContractCustomRepository {

    @PersistenceContext
    EntityManager entityManager;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);


    @Override
    public Page<ContractPayload> findByCoordinatorAsDictionary(final List<OrganizationUnit> coordinators, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Contract> query = criteriaBuilder.createQuery(Contract.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Contract> criteriaRoot = query.from(Contract.class);
        criteriaRoot.join("contractObject", JoinType.LEFT);
        Root<Contract> criteriaRootCount = count.from(Contract.class);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<ContractPayload> results = new ArrayList<>();

        predicates.add(criteriaRoot.get("coordinator").in(coordinators));

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getName().equals("searchValue")) {
                        Predicate contractObject = criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("contractObject").get("content")), "%" + cond.getValue().toLowerCase() + "%");
                        Predicate code = criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("number")), "%" + cond.getValue().toLowerCase() + "%");
                        predicates.add(criteriaBuilder.or(contractObject, code));
                    }
                }
            });
        }

        query.where(predicates.toArray(new Predicate[0]));
        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicates.toArray(new Predicate[0]));

        if (order != null) {

            if (order.getProperty().equals("code")) {
                Sort sort = new Sort(order.getDirection(), "number");
                query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
            }
        }

        TypedQuery<Contract> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(contract -> {
            ContractPayload contractPayload = new ContractPayload(
                    contract.getId(),
                    contract.getCode(),
                    contract.getNumber(),
                    contract.getContractObject().getContent(),
                    contract.getCoordinator().getName(),
                    contract.getSigningDate(),
                    contract.getPeriodFrom(),
                    contract.getPeriodTo(),
                    contract.getContractObject().getContent(),
                    contract.getContractValueNet(),
                    contract.getContractValueGross(),
                    contract.getOptionValueNet(),
                    contract.getOptionValueGross(),
                    contract.getInvoicesValueNet(),
                    contract.getInvoicesValueGross(),
                    contract.getRealPrevYearsValueNet(),
                    contract.getRealPrevYearsValueGross(),
                    contract.getRealizedValueNet(),
                    contract.getRealizedValueGross(),
                    contract.getRealizedOptionValueNet(),
                    contract.getRealizedOptionValueGross()
            );
            results.add(contractPayload);
        });

        if (order != null && order.getProperty().equals("contractObject")) {
            if (order.getDirection().isAscending()) {
                results.sort(Comparator.comparing(ContractPayload::getContractObject, String::compareToIgnoreCase));
            } else {
                results.sort(Comparator.comparing(ContractPayload::getContractObject, String::compareToIgnoreCase).reversed());
            }
        }

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }

    @Override
    public Page<ContractPayload> findContractsPageable(final List<OrganizationUnit> coordinators, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport, final String accessLevel) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Contract> query = criteriaBuilder.createQuery(Contract.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Contract> criteriaRoot = query.from(Contract.class);
        criteriaRoot.join("contractObject", JoinType.LEFT);
        Root<Contract> criteriaRootCount = count.from(Contract.class);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);

        List<Predicate> predicates = new ArrayList<>();
        List<ContractPayload> results = new ArrayList<>();

        if (accessLevel.equals("coordinator")) {
            predicates.add(criteriaRoot.get("coordinator").in(coordinators));
        }

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getName().equals("contractObject")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName()).get("content")), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getName().equals("coordinator")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("code"), cond.getValue()));
                    } else if (cond.getName().equals("year")) {
                        if (Integer.parseInt(cond.getValue()) == 0) {
                            LocalDate curYear = LocalDate.of(2020, Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("signingDate"), firstDay));
                        } else {
                            LocalDate curYear = LocalDate.of(Integer.parseInt(cond.getValue()), Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
                            predicates.add(criteriaBuilder.between(criteriaRoot.get("signingDate"), firstDay, lastDay));
                        }
                    } else if (cond.getName().equals("signedFrom")) {
                        LocalDateTime saleFrom = LocalDateTime.parse(cond.getValue(), formatter);
                        Date saleFromDate = Date.from(saleFrom.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("signingDate"), saleFromDate));
                    } else if (cond.getName().equals("signedTo")) {
                        LocalDateTime saleTo = LocalDateTime.parse(cond.getValue(), formatter);
                        Date saleToDate = Date.from(saleTo.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("signingDate"), saleToDate));
                    }
                }
            });
        }

        if (order != null) {
            if (!order.getProperty().equals("realizedValueGross")) {
                Sort sort = new Sort(order.getDirection(), order.getProperty().substring(0,
                        order.getProperty().lastIndexOf(".") != -1 ? order.getProperty().lastIndexOf(".") : order.getProperty().length()
                ));
                query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
            } else {
                Sort sort = new Sort(order.getDirection(), "id");
                query.orderBy(QueryUtils.toOrders(sort, criteriaRoot, criteriaBuilder));
            }
        }

        query.where(predicates.toArray(new Predicate[0]));
        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicates.toArray(new Predicate[0]));

        TypedQuery<Contract> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(contract -> {
            ContractPayload contractPayload = new ContractPayload(
                    contract.getId(),
                    contract.getCode(),
                    contract.getNumber(),
                    contract.getContractObject().getContent(),
                    contract.getCoordinator().getName(),
                    contract.getSigningDate(),
                    contract.getPeriodFrom(),
                    contract.getPeriodTo(),
                    contract.getContractObject().getContent(),
                    contract.getContractValueNet(),
                    contract.getContractValueGross(),
                    contract.getContractValueNet(),
                    contract.getContractValueGross(),
                    contract.getInvoicesValueNet(),
                    contract.getInvoicesValueGross(),
                    contract.getRealPrevYearsValueNet(),
                    contract.getRealPrevYearsValueGross(),
                    contract.getRealizedValueNet(),
                    contract.getRealizedValueGross(),
                    contract.getRealizedOptionValueNet(),
                    contract.getRealizedOptionValueGross()
            );
            results.add(contractPayload);
        });

        if (order != null) {
            if (order.getProperty().equals("contractObject")) {
                if (order.getDirection().isAscending()) {
                    results.sort(Comparator.comparing(ContractPayload::getContractObject, String::compareToIgnoreCase));
                } else {
                    results.sort(Comparator.comparing(ContractPayload::getContractObject, String::compareToIgnoreCase).reversed());
                }
            } else if (order.getProperty().equals("realizedValueGross")) {
                if (order.getDirection().isAscending()) {
                    results.sort(Comparator.comparing(ContractPayload::getRealizedValueGross, Comparator.nullsFirst(Comparator.naturalOrder())));
                } else {
                    results.sort(Comparator.comparing(ContractPayload::getRealizedValueGross, Comparator.nullsLast(Comparator.reverseOrder())));
                }
            }
        }

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }

}
