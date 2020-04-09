package pl.viola.ems.payload.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import pl.viola.ems.model.modules.administrator.Group;
import pl.viola.ems.model.security.AcPermission;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class UserDetails {
    private Long id;
    @NonNull
    @NotBlank
    private String username;
    @NonNull
    @NotBlank
    private String surname;
    @NonNull
    @NotBlank
    private String name;

    private String password;
    private Boolean isActive;
    private Boolean isLocked;
    private Boolean isExpired;
    private Boolean isCredentialsExpired;

    @NonNull
    private String unit;
    private Set<AcPermission> permissions;
    private Set<Group> groups;

    public UserDetails(String username, String surname, String name, String password, Boolean isActive, Boolean isLocked, Boolean isExpired, Boolean isCredentialsExpired, String unit){
        this.username = username;
        this.surname = surname;
        this.name = name;
        this.password = password;
        this.isActive = isActive;
        this.isLocked = isLocked;
        this.isExpired = isExpired;
        this.isCredentialsExpired = isCredentialsExpired;
        this.unit = unit;
    }
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

}
