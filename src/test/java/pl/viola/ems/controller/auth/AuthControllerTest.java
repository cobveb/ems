package pl.viola.ems.controller.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.modules.administrator.OrganizationUnit;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.security.AcPermission;
import pl.viola.ems.payload.auth.JwtAuthenticationResponse;
import pl.viola.ems.payload.auth.LoginRequest;
import pl.viola.ems.payload.auth.PasswordChangeRequest;
import pl.viola.ems.payload.auth.RefreshTokenRequest;
import pl.viola.ems.security.impl.JwtTokenProvider;
import pl.viola.ems.security.impl.UserPrincipal;
import pl.viola.ems.service.security.JwtTokenService;
import pl.viola.ems.service.security.PasswordService;

import java.util.Date;
import java.util.HashSet;

import static groovy.json.JsonOutput.toJson;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @MockBean
    JwtTokenService jwtTokenService;

    @MockBean
    AuthenticationManager authenticationManager;

    @MockBean
    Authentication authentication;

    @MockBean
    JwtTokenProvider tokenProvider;

    @MockBean
    PasswordService passwordService;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();
    }

    @DisplayName("Auth - Controller - login")
    @Test
    void authenticateUser() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("UserTest");
        loginRequest.setPassword("passwd");
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

        User mockUser = new User((long)0,
                "UserTest",
                "user",
                new Date(),
                "User",
                "Test",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>()
        );
        UserPrincipal userPrincipal = UserPrincipal.create(mockUser);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword());
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, userPrincipal.getPassword());
        Mockito.when(authenticationManager.authenticate(auth)).thenReturn(authentication);
        Mockito.when(tokenProvider.generateToken(userPrincipal)).thenReturn("accessToken");
        Mockito.when(tokenProvider.generateRefreshToken()).thenReturn("refreshToken");

        JwtAuthenticationResponse response = new JwtAuthenticationResponse("accessToken", "refreshToken");
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value(response.getAccessToken()))
                .andExpect(jsonPath("$.refreshToken").value(response.getRefreshToken()))
                .andExpect(jsonPath("$.tokenType").value(response.getTokenType()));
    }

    @DisplayName("Auth - Controller - refreshToken")
    @Test
    void refreshToken() throws Exception {
        RefreshTokenRequest refreshTokenRequest = new RefreshTokenRequest();
        refreshTokenRequest.setRefreshToken("Token");
        OrganizationUnit ou = new OrganizationUnit("uck", "UCK", "Uck", "uck@uck.katowice.pl", true, false);

        User mockUser = new User((long)0,
                "UserTest",
                "user",
                new Date(),
                "User",
                "Test",
                true,
                false,
                false,
                false,
                ou,
                new HashSet<AcPermission>(),
                new HashSet<Group>());
        Mockito.when(jwtTokenService.findById(refreshTokenRequest.getRefreshToken())).thenReturn(mockUser);

        UserPrincipal mockPrincipal = UserPrincipal.create(jwtTokenService.findById(refreshTokenRequest.getRefreshToken()));
        Mockito.when(tokenProvider.generateRefreshToken()).thenReturn("refreshToken");
        Mockito.when(tokenProvider.generateToken(mockPrincipal)).thenReturn("accessToken");
        mvc.perform(post("/api/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(refreshTokenRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
    }

    @DisplayName("Auth - Controller - deleteToken")
    @Test
    void deleteToken() throws Exception {

        mvc.perform(delete("/api/auth/token/delete/token"))
                .andExpect(status().isAccepted());
    }

    @DisplayName("Auth - Controller - deleteToken - Exception")
    @Test
    void deleteRefreshTokenException() throws Exception {

        jwtTokenService.deleteRefreshToken("TokenNew");
        doThrow(new EmptyResultDataAccessException(1)).when(jwtTokenService).deleteRefreshToken("token");
        mvc.perform(delete("/api/auth/token/delete/token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("No entity found"));
    }

    @WithMockUser
    @DisplayName("Auth - Controller - changePassword")
    @Test
    void changePassword() throws Exception {
        PasswordChangeRequest passwordChangeRequest = new PasswordChangeRequest();
        passwordChangeRequest.setUsername("user");
        passwordChangeRequest.setOldPassword("old");
        passwordChangeRequest.setNewPassword("new");

        passwordService.changePassword(passwordChangeRequest);

        mvc.perform(post("/api/auth/changePassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(passwordChangeRequest)))
                .andExpect((jsonPath("$.status").value("ACCEPTED")))
                .andExpect(jsonPath("$.data").value("Hasło zostało zmienione."));;
    }

}