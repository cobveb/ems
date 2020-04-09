package pl.viola.ems.service.security.impl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.security.UserPrincipal;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class CustomUserDetailsServiceImplTest {
    @TestConfiguration
    static class CustomUserDetailsServiceImplTestContextConfiguration {

        @Bean
        public CustomUserDetailsServiceImpl customUserDetailsService (){
            return new CustomUserDetailsServiceImpl();
        }
    }

    @Autowired
    private CustomUserDetailsServiceImpl customUserDetailsService;

    @MockBean
    private UserRepository userRepository;

    private Throwable thrown;

    private OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

    @DisplayName("loadUserByUsername")
    @Test
    void loadUserByUsername() {

        User user = new User((long)1,"user", "userPass", new Date(), "UserName", "UserSurname",true,false,false,false, ou, new HashSet<AcPermission>(), new HashSet<Group>());
        /*Set<User> users = new HashSet<User>();
        users.add(user);
        AcPermission acPermission = new AcPermission((long)1, new AcObject((long)1, (long)1, "test", "module", new HashSet<AcPrivilege>()), new AcPrivilege());
        Set<AcPermission> permissions = new HashSet<AcPermission>();
        permissions.add(acPermission);
        Group groups = new Group((long) 1, "test", "GR_TEST", permissions, users );*/

        Mockito.when(userRepository.findByUsername("user")).thenReturn(java.util.Optional.of(user));

        Optional<User> test = userRepository.findByUsername("user");
        UserPrincipal userC = (UserPrincipal) customUserDetailsService.loadUserByUsername("user");

        User newUser = new User((long)1,"user", "userPass", new Date(), "UserName", "UserSurname",true,false,false,false, ou, new HashSet<AcPermission>(),new HashSet<Group>());


        assertThat(userC).isNotNull();
        assertEquals(test.get(), newUser);
        assertEquals(userC, UserPrincipal.create(newUser));
        assertThat(userC.isAccountNonExpired()).isTrue();
        assertThat(userC.isAccountNonLocked()).isTrue();
        assertThat(userC.isCredentialsNonExpired()).isTrue();
        assertThat(userC.isEnabled()).isTrue();
    }

    @DisplayName("loadUserByUsername - Exception")
    @Test
    void loadUserByUsernameNotFoundException(){

        Mockito.when(userRepository.findByUsername("admin")).thenReturn(Optional.empty());

        thrown = assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername("admin");
        });

        assertEquals("User not found with username : admin", thrown.getMessage());
    }

    @DisplayName("loadUserById")
    @Test
    void loadUserById() {
//        User user = new User("user", "passwd", "UserName", "UserSurname", true, false, false, false, ou);
//        user.setId((long)0);
        User user = new User((long)0,"user", "userPass", new Date(), "UserName", "UserSurname",true,false,false,false, ou, new HashSet<AcPermission>(),new HashSet<Group>());

        List<User> repo = Arrays.asList(user);
        List<Long> ids = Arrays.asList((long)0);
        Mockito.when(userRepository.findById((long)0)).thenReturn(Optional.of(user));

        UserPrincipal userC = (UserPrincipal) customUserDetailsService.loadUserById((long)0);
        assertThat(userC).isNotNull();
        assertThat(userC.getUsername()).isEqualTo("user");

    }

    @DisplayName("loadUserByUsername - Exception")
    @Test
    void loadUserByIdNotFoundException(){

        Mockito.when(userRepository.findById((long)0)).thenReturn(Optional.empty());

        thrown = assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserById((long)0);
        });

        assertEquals("User not found with id : 0", thrown.getMessage());
    }
}