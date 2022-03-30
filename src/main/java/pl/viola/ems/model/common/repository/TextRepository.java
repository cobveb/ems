package pl.viola.ems.model.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.Text;

@Repository
public interface TextRepository extends JpaRepository<Text, Long> {
}
