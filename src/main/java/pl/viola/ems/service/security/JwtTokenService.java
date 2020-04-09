package pl.viola.ems.service.security;

import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.security.UserPrincipal;

public interface JwtTokenService {

    void saveRefreshToken(UserPrincipal userPrincipal, String refreshToken);

    void deleteRefreshToken(String refreshToken);

    User findById(String refreshToken);
}
