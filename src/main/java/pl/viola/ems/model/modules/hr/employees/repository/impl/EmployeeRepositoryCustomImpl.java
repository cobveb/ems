package pl.viola.ems.model.modules.hr.employees.repository.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.hr.employees.Employee;
import pl.viola.ems.model.modules.hr.employees.repository.EmployeeRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class EmployeeRepositoryCustomImpl implements EmployeeRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;


    @Override
    public Page<Employee> findEmployeesPageable(List<SearchCondition> conditions, Pageable pageable, Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Employee> query = criteriaBuilder.createQuery(Employee.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Employee> criteriaRoot = query.from(Employee.class);
        Root<Employee> criteriaRootCount = count.from(Employee.class);

        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();

        if (!conditions.isEmpty()) {

            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                        predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    }
                }
            });
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(QueryUtils.toOrders(pageable.getSort(), criteriaRoot, criteriaBuilder));

        TypedQuery<Employee> typedQuery = entityManager.createQuery(query);

        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));

        return new PageImpl<>(typedQuery.getResultList(), pageable, entityManager.createQuery(count).getSingleResult());

    }
}
