package pl.viola.ems.model.modules.asi.dictionary.register.repository.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;
import pl.viola.ems.model.modules.asi.dictionary.register.repository.AsiDictionaryRegisterCustomRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class AsiDictionaryRegisterCustomRepositoryImpl implements AsiDictionaryRegisterCustomRepository {
    @PersistenceContext
    EntityManager entityManager;

    @Override
    public Page<DictionaryRegister> findRegisterPageable(final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<DictionaryRegister> query = criteriaBuilder.createQuery(DictionaryRegister.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<DictionaryRegister> criteriaRoot = query.from(DictionaryRegister.class);
        Root<DictionaryRegister> criteriaRootCount = count.from(DictionaryRegister.class);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);
        List<Predicate> predicates = new ArrayList<>();
        List<Predicate> predicatesCount = new ArrayList<>();

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (cond.getType().equals("text")) {
                    predicates.add(criteriaBuilder.or(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%")));
                    predicatesCount.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRootCount.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
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
        count.select(criteriaBuilder.count(criteriaRootCount)).where(predicatesCount.toArray(new Predicate[0]));

        TypedQuery<DictionaryRegister> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        return new PageImpl<>(typedQuery.getResultList(), pageable, entityManager.createQuery(count).getSingleResult());
    }
}
