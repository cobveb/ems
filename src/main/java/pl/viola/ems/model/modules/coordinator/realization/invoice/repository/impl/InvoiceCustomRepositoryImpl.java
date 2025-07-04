package pl.viola.ems.model.modules.coordinator.realization.invoice.repository.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.query.QueryUtils;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.coordinator.realization.invoice.Invoice;
import pl.viola.ems.model.modules.coordinator.realization.invoice.repository.InvoiceCustomRepository;
import pl.viola.ems.payload.modules.coordinator.realization.invoice.InvoicePayload;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

public class InvoiceCustomRepositoryImpl implements InvoiceCustomRepository {
    @PersistenceContext
    EntityManager entityManager;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);


    @Override
    public Page<InvoicePayload> findInvoicesPageable(final List<OrganizationUnit> coordinators, final List<SearchCondition> conditions, final Pageable pageable, final Boolean isExport, final String accessLevel) {

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Invoice> query = criteriaBuilder.createQuery(Invoice.class);
        CriteriaQuery<Long> count = criteriaBuilder.createQuery(Long.class);

        Root<Invoice> criteriaRoot = query.from(Invoice.class);
        Root<Invoice> criteriaRootCount = count.from(Invoice.class);

        Sort.Order order = pageable.getSort().stream().findFirst().orElse(null);

        List<Predicate> predicates = new ArrayList<>();
        List<InvoicePayload> results = new ArrayList<>();

        if (accessLevel.equals("coordinator")) {
            predicates.add(criteriaRoot.get("coordinator").in(coordinators));
        }

        if (!conditions.isEmpty()) {
            conditions.forEach(cond -> {
                if (!cond.getValue().isEmpty()) {
                    if (cond.getType().equals("text")) {
                        predicates.add(criteriaBuilder.like(criteriaBuilder.lower(criteriaRoot.get(cond.getName())), "%" + cond.getValue().toLowerCase() + "%"));
                    } else if (cond.getName().equals("coordinator")) {
                        predicates.add(criteriaBuilder.equal(criteriaRoot.get(cond.getName()).get("code"), cond.getValue()));
                    } else if (cond.getName().equals("year")) {
                        if (Integer.parseInt(cond.getValue()) == 0) {
                            LocalDate curYear = LocalDate.of(2020, Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sellDate"), firstDay));
                        } else {
                            LocalDate curYear = LocalDate.of(Integer.parseInt(cond.getValue()), Month.JANUARY, 1);
                            Date firstDay = java.sql.Date.valueOf(curYear.with(firstDayOfYear()));
                            Date lastDay = java.sql.Date.valueOf(curYear.with(lastDayOfYear()));
                            predicates.add(criteriaBuilder.between(criteriaRoot.get("sellDate"), firstDay, lastDay));
                        }
                    } else if (cond.getName().equals("saleFrom")) {
                        LocalDateTime saleFrom = LocalDateTime.parse(cond.getValue(), formatter);
                        Date saleFromDate = Date.from(saleFrom.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaRoot.get("sellDate"), saleFromDate));
                    } else if (cond.getName().equals("saleTo")) {
                        LocalDateTime saleTo = LocalDateTime.parse(cond.getValue(), formatter);
                        Date saleToDate = Date.from(saleTo.atZone(ZoneId.systemDefault()).toInstant());
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaRoot.get("sellDate"), saleToDate));
                    }
                }
            });
        }

        if (order != null) {
            if (!order.getProperty().equals("invoiceValueGross")) {
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

        TypedQuery<Invoice> typedQuery = entityManager.createQuery(query);
        if (!isExport) {
            typedQuery.setFirstResult(Math.toIntExact(pageable.getOffset()));
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        typedQuery.getResultList().forEach(invoice -> {
            InvoicePayload invoicePayload = new InvoicePayload(
                    invoice.getId(),
                    invoice.getNumber(),
                    invoice.getSellDate(),
                    invoice.getInvoiceValueGross(),
                    invoice.getCoordinator(),
                    invoice.getContractor()
            );
            results.add(invoicePayload);
        });

        if (order != null && order.getProperty().equals("invoiceValueGross")) {
            if (order.getDirection().isAscending()) {
                results.sort(Comparator.comparing(InvoicePayload::getInvoiceValueGross, Comparator.nullsFirst(Comparator.naturalOrder())));
            } else {
                results.sort(Comparator.comparing(InvoicePayload::getInvoiceValueGross, Comparator.nullsLast(Comparator.reverseOrder())));
            }
        }

        return new PageImpl<>(results, pageable, entityManager.createQuery(count).getSingleResult());
    }
}
