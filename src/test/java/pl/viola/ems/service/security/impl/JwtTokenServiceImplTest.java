package pl.viola.ems.service.security.impl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.GrantedAuthority;
import pl.viola.ems.model.auth.JwtRefreshToken;
import pl.viola.ems.model.auth.repository.JwtRefreshTokenRepository;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.security.JwtTokenService;

import java.util.Date;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class JwtTokenServiceImplTest {

    @TestConfiguration
    static class JwtTokenServiceImplTestContextConfiguration {

        @Bean
        public JwtTokenService jwtTokenService(){
            return new JwtTokenServiceImpl();
        }
    }

    @Autowired
    JwtTokenService jwtTokenService;

    @MockBean
    JwtRefreshTokenRepository jwtRefreshTokenRepository;

    @MockBean
    UserRepository userRepository;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    @Value("${app.jwtExpirationRefreshInMs}")
    private int jwtExpirationRefreshInMs;

    @DisplayName("delete refresh token")
    @Test
    void deleteRefreshToken() {
        jwtTokenService.deleteRefreshToken("TokenNew");
        verify(jwtRefreshTokenRepository, times(1)).deleteById("TokenNew");
    }

    @DisplayName("findById")
    @Test
    void findById() {
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);
        JwtRefreshToken token = new JwtRefreshToken("Token");
        User user = new User((long)1,"user", "userPass", new Date(), "UserName", "UserSurname",true,false,false,false, ou, new HashSet<AcPermission>(), new HashSet<Group>());
        token.setUser(user);

        Mockito.when(jwtRefreshTokenRepository.findById("Token")).thenReturn(Optional.of(token));
        
        User find = jwtTokenService.findById("Token");

        assertThat(find).isNotNull();
        assertThat(find.getName()).isEqualTo("UserName");
    }

    @DisplayName("refresh token")
    @Test
    void saveRefreshToken() {
        UserPrincipal principal = new UserPrincipal((long) 0, "UserName", "UserSurname", "user", true, false, false, false, "passwd", new HashSet<GrantedAuthority>(), new HashSet<String>());
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true);
        JwtRefreshToken newToken = new JwtRefreshToken("TokenNew");
        User user = new User((long)1,"user", "userPass", new Date(), "UserName", "UserSurname",true, false,false,false, ou, new HashSet<AcPermission>(), new HashSet<Group>());
        newToken.setUser(user);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs + jwtExpirationRefreshInMs);

        newToken.setExpirationDateTime(expiryDate);

        Mockito.when(userRepository.getOne(principal.getId())).thenReturn(user);
        jwtTokenService.saveRefreshToken(principal, "TokenNew");

        verify(jwtRefreshTokenRepository, times(1)).save(newToken);
    }
}