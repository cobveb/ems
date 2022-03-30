package pl.viola.ems.security.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.administrator.Parameter;
import pl.viola.ems.security.PasswordValidator;
import pl.viola.ems.service.modules.administrator.ParameterService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequestScope
public class PasswordValidatorImpl implements PasswordValidator {

    private Pattern pattern;

    private Matcher matcher;

    private String password_pattern;

    private static final String MIN_DEFAULTS = "1";

    private static final String MIN_CHAR_DEFAULTS = "8";

    @Autowired
    private ParameterService parameterService;

    public boolean validate(final String password){
        List<Parameter> passwordParams = parameterService.findByCodeIn(Arrays.asList("minLowercase", "minUppercase", "minSpecialChar", "minDigits"));
        Parameter minCharLength = parameterService.findById("minCharLength").orElse(null);
        password_pattern = "(";
        passwordParams.forEach(condition -> {
            password_pattern += setParameterPattern(condition);
        });
        password_pattern += ".{" + setParameterValue(minCharLength) + ",20}";
        password_pattern += ")";
        pattern = Pattern.compile(password_pattern);
        boolean valid = pattern.matcher(password).matches();
        if (valid) {
            return valid;
        } else {
            List<String> values = new ArrayList<String>();
            passwordParams.forEach(condition->{
                values.add(setParameterValue(condition));
            });
            throw new AppException(
                HttpStatus.BAD_REQUEST,
                "Security.password.incorrectStrength",
                values.get(0),
                values.get(1),
                values.get(2),
                values.get(3),
                    minCharLength.getValue()
            );
        }
    }

    private String setParameterPattern(Parameter parameter){
        String pattern;
        String value;
        value = setParameterValue(parameter);
        switch (parameter.getCode()){
            case "minDigits": {
                pattern = "(?=(?:.*\\d.*){"+ value +"})";
                break;
            }
            case "minLowercase": {
                pattern = "(?=(?:.*[a-z].*){"+ value +"})";
                break;
            }
            case "minUppercase": {
                pattern = "(?=(?:.*[A-Z].*){"+ value +"})";
                break;
            }
            case "minSpecialChar": {
                pattern = "(?=(?:.*[@#$%!&*^.].*){" + value + "})";
                break;
            }
            default:{
                pattern = "";
            }
        }
        return  pattern;
    }

    private String setParameterValue(Parameter parameter){
        if(!"minCharLength".equals(parameter.getCode()) && parameter.getValue() == null ){
           return MIN_DEFAULTS;
        } else if("minCharLength".equals(parameter.getCode()) &&  parameter.getValue() == null ) {
            return MIN_CHAR_DEFAULTS;
        } else {
           return parameter.getValue();
        }
    }
}
