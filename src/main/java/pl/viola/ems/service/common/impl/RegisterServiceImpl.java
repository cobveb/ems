package pl.viola.ems.service.common.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.register.Register;
import pl.viola.ems.model.common.register.RegisterPosition;
import pl.viola.ems.model.common.register.repository.RegisterPositionRepository;
import pl.viola.ems.model.common.register.repository.RegisterRepository;
import pl.viola.ems.model.modules.administrator.User;
import pl.viola.ems.model.modules.iod.register.RegisterCpdoPosition;
import pl.viola.ems.service.common.RegisterService;
import pl.viola.ems.utils.Utils;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Service
public class RegisterServiceImpl implements RegisterService {

    @Autowired
    RegisterRepository registerRepository;


    @Autowired
    RegisterPositionRepository<RegisterCpdoPosition> registerCpdoPositionRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<Register> getRegisters(final String module) {
        Set<String> codes = new HashSet<>();

        switch (module) {

            case "iod":
                codes.add("cpdo");
                break;
        }
        return registerRepository.findByCodeIn(codes);
    }

    @Override
    public <T extends RegisterPosition> Set<T> getRegisterPositions(final String registerCode) {
        Register register = registerRepository.findByCode(registerCode)
                .orElseThrow(() -> new AppException("Register.registerNotFound", HttpStatus.NOT_FOUND));

        return (Set<T>) registerCpdoPositionRepository.findByRegister(register);
    }

    @Override
    public <T extends RegisterPosition> Set<T> getActivePositionsByRegister(final String registerCode) {
        Register register = registerRepository.findByCode(registerCode)
                .orElseThrow(() -> new AppException("Register.registerNotFound", HttpStatus.NOT_FOUND));

        return (Set<T>) registerCpdoPositionRepository.findByRegisterAndIsActiveTrueOrderByName(register);
    }

    @Transactional
    @Override
    public Register saveRegister(final Register register) {

        User user = Utils.getCurrentUser();

        register.setUpdateUser(user);

        return registerRepository.save(register);
    }

    @Transactional
    @Override
    public RegisterPosition saveRegisterPosition(final String registerCode, final RegisterPosition position) {
        Register register = registerRepository.findByCode(registerCode)
                .orElseThrow(() -> new AppException("Register.registerNotFound", HttpStatus.NOT_FOUND));
        position.setRegister(register);
        return registerCpdoPositionRepository.save((RegisterCpdoPosition) position);
    }

    @Transactional
    @Override
    public String deleteRegisterPosition(final String registerCode, final Long positionId) {
        if (this.getRegisterPositions(registerCode).stream().anyMatch(position -> position.getId().equals(positionId))) {
            registerCpdoPositionRepository.deleteById(positionId);
        }
        return messageSource.getMessage("Register.position.deleteMsg", null, Locale.getDefault());
    }
}
