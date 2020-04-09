package pl.viola.ems.service.security;

import pl.viola.ems.payload.auth.PasswordChangeRequest;

import java.util.Date;

public interface PasswordService {

    void changePassword(PasswordChangeRequest passwordChangeRequest);

    boolean validatePassword(final String password);

    boolean isCredentialExpired(Date lastPasswordChange);
}
