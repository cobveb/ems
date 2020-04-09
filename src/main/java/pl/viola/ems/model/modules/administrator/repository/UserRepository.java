package pl.viola.ems.model.modules.administrator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	 
	List<User> findByUsernameIn(List<String> usersNames);

	Optional<User> findByUsername(String username);
	
	Boolean existsByUsername(String username);

	List<User> findByGroups(Group group);

}
