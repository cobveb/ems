package pl.viola.ems.service.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.repository.UserRepository;
import pl.viola.ems.payload.auth.PasswordChangeRequest;
import pl.viola.ems.security.PasswordValidator;
import pl.viola.ems.service.modules.administrator.ParameterService;
import pl.viola.ems.service.security.PasswordService;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
public class PasswordServiceImpl implements PasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ParameterService parameterService;

    @Autowired
    private PasswordValidator passwordValidator;


    @Override
    @Transactional
    public void changePassword(PasswordChangeRequest passwordChangeRequest) {
        userRepository.findByUsername(passwordChangeRequest.getUsername()).map(user -> {
            if (passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
                if(this.validatePassword(passwordChangeRequest.getNewPassword())) {
                    if (passwordEncoder.matches(passwordChangeRequest.getNewPassword(), user.getPassword())) {
                        throw new AppException("Security.password.newPasswordEqual", HttpStatus.BAD_REQUEST);
                    } else {
                        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
                        user.setIsCredentialsExpired(false);
                        userRepository.save(user);
                        return user;
                    }
                } else {

                    throw new AppException("Security.password.incorrectStrength", HttpStatus.BAD_REQUEST);
                }
            } else {
                throw new AppException("Security.password.incorrectOldPassword", HttpStatus.BAD_REQUEST);
            }
        }).orElseThrow(() -> new AppException("Administrator.user.notFound", HttpStatus.NOT_FOUND));
    }

    @Override
    public boolean validatePassword(String password) {

        return passwordValidator.validate(password);
    }

    @Override
    public boolean isCredentialExpired(Date lastPasswordChange) {

        long diff = new Date(System.currentTimeMillis()).getTime() - lastPasswordChange.getTime();

        String passValidPeriod = parameterService.findById("passValidPeriod").get().getValue();

        if (passValidPeriod == null) {
            return false;
        }

        return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) >= Long.parseLong(passValidPeriod);

    }
}
