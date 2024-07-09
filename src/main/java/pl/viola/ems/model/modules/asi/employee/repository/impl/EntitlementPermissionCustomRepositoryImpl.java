package pl.viola.ems.model.modules.asi.employee.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.employee.Entitlement;
import pl.viola.ems.model.modules.asi.employee.repository.EntitlementPermissionCustomRepository;
import pl.viola.ems.model.modules.asi.employee.repository.EntitlementPermissionRepository;
import pl.viola.ems.model.modules.asi.register.AsiRegisterPosition;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.service.modules.asi.dictionary.register.AsiDictionaryRegisterService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class EntitlementPermissionCustomRepositoryImpl implements EntitlementPermissionCustomRepository {
    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    EntitlementPermissionRepository entitlementPermissionRepository;

    @Autowired
    AsiDictionaryRegisterService asiDictionaryRegisterService;

    @Override
    public Page<AsiRegisterPosition> findRegistersPositionsPageable(final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Entitlement> query = criteriaBuilder.createQuery(Entitlement.class);

        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Entitlement> criteriaRoot = query.from(Entitlement.class);
        Join<Entitlement, EntitlementSystem> criteriaEntitlementSystem = criteriaRoot.join("entitlementSystem", JoinType.LEFT);
        Join<Entitlement, Employee> criteriaEmployee = criteriaRoot.join("employee", JoinType.LEFT);

        Root<Entitlement> criteriaRootCount = count.from(Entitlement.class);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();
        List<AsiRegisterPosition> results = new ArrayList<>();
        final AtomicBoolean isRegisterCondition = new AtomicBoolean(false);

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    switch (cond.getName()) {
                        case "entitlementSystem":
                            predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("id"), cond.getValue()));
                            predicatesCount.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("id"), cond.getValue()));
                            break;
                        case "register":
                            predicates.add(criteriaBuilder.equal(criteriaRoot.get("entitlementSystem").get(cond.getName()).get("id"), cond.getValue()));
                            predicatesCount.add(criteriaBuilder.equal(criteriaRoot.get("entitlementSystem").get(cond.getName()).get("id"), cond.getValue()));
                            isRegisterCondition.set(true);
                            break;
                        case "employee":
                            predicates.add(criteriaBuilder.and(criteriaBuilder.or(
                                    criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("employee").get("name")), "%" + cond.getValue().toLowerCase() + "%"),
                                    criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("employee").get("surname")), "%" + cond.getValue().toLowerCase() + "%"))
                            ));
                            predicatesCount.add(criteriaBuilder.and(criteriaBuilder.or(
                                    criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("employee").get("name")), "%" + cond.getValue().toLowerCase() + "%"),
                                    criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get("employee").get("surname")), "%" + cond.getValue().toLowerCase() + "%"))
                            ));
                            break;
                        case "inactive":
                            if (cond.getValue().equals("false")) {
                                predicates.add(criteriaBuilder.and(criteriaBuilder.or(
                                        criteriaBuilder.isNull(criteriaRoot.get("dateTo")),
                                        criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("dateTo"), new Date()))
                                ));
                                predicatesCount.add(criteriaBuilder.and(criteriaBuilder.or(
                                        criteriaBuilder.isNull(criteriaRoot.get("dateTo")),
                                        criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("dateTo"), new Date()))
                                ));
                            }
                            break;
                    }
                }
            });
        }

        if (!isRegisterCondition.get()) {
            predicates.add(criteriaRoot.get("entitlementSystem").get("register").in(asiDictionaryRegisterService.getActiveDictionaryRegisters()));
            predicatesCount.add(criteriaRoot.get("entitlementSystem").get("register").in(asiDictionaryRegisterService.getActiveDictionaryRegisters()));
        }

        query.where(predicates.toArray(new Predicate[0]));

        if (order != null) {
            String sortProperty = order.getProperty().substring(0, order.getProperty().lastIndexOf(".") != -1 ? order.getProperty().lastIndexOf(".") : order.getProperty().length());
            if (!sortProperty.equals("entitlementSystemPermission")) {
                Sort sort = new Sort(order.getDirection(), sortProperty.equals("employee") ? "name" : sortProperty);
                query.orderBy(QueryUtils.toOrders(sort, sortProperty.equals("employee") ? criteriaEmployee : sortProperty.equals("register") ? criteriaEntitlementSystem : criteriaRoot, criteriaBuilder));
            }
        }

        TypedQuery<Entitlement> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(result -> {

            AsiRegisterPosition registerPosition = new AsiRegisterPosition(
                    result.getId(),
                    result.getEntitlementSystem().getRegister().getName(),
                    result.getEntitlementSystem().getName(),
                    entitlementPermissionRepository.findByEntitlementOrderById(result).stream().map(entitlementPermission -> entitlementPermission.getEntitlementSystemPermission().getName()).collect(Collectors.joining("; ")),
                    result.getEmployee().getName() + " " + result.getEmployee().getSurname(),
                    result.getUsername()
            );
            results.add(registerPosition);
        });

        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));

        if (order != null && order.getProperty().equals("entitlementSystemPermission")) {
            if (order.getDirection().isAscending()) {
                results.sort(Comparator.comparing(AsiRegisterPosition::getEntitlementSystemPermission, String::compareToIgnoreCase));
            } else {
                results.sort(Comparator.comparing(AsiRegisterPosition::getEntitlementSystemPermission, String::compareToIgnoreCase).reversed());
            }
        }

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }
}
