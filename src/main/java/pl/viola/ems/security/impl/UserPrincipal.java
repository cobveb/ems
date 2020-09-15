package pl.viola.ems.security.impl;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.viola.ems.model.modules.administrator.User;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


@Data
@AllArgsConstructor
public class UserPrincipal implements UserDetails{

	private static final long serialVersionUID = 6428478520784408369L;

	private Long id;

    private String name;
    
    private String surname;

    private String username;

	private Boolean isActive;

	private Boolean isLocked;

	private Boolean isExpired;

	private Boolean isCredentialsExpired;
    
    @JsonIgnore
    private String password;
    
    @Setter
    private Collection<? extends GrantedAuthority> authorities;


	private Collection<String> groups;

    public static UserPrincipal create(User user) {
		return new UserPrincipal(
			user.getId(),
			user.getName(),
			user.getSurname(),
			user.getUsername(),
			user.getIsActive(),
			!user.getIsLocked(),
			!user.getIsExpired(),
			!user.getIsCredentialsExpired(),
			user.getPassword(),
			setAuthorities(user),
			setGroups(user)
		);
    }
    
	public boolean isAccountNonExpired() {
		return isExpired;
	}

	public boolean isAccountNonLocked() {
    	return isLocked;
	}

	public boolean isCredentialsNonExpired() {return isCredentialsExpired;}

	public boolean isEnabled() {
    	return isActive;
	}

	private static List<GrantedAuthority> setAuthorities(final User user){

    	List<GrantedAuthority> authorities = user.getAcPermissions().stream().map(permission ->
			new SimpleGrantedAuthority(permission.getAcPrivilege().getCode() + "_" +
				permission.getAcObject().getDomainModelId() + "_" +
				permission.getAcObject().getObjectClass())
		).collect(Collectors.toList());

    	if (!user.getGroups().isEmpty()) {
			user.getGroups().stream().forEach(group ->
				authorities.addAll(group.getAcPermissions().stream().map(acPermission ->
					new SimpleGrantedAuthority(acPermission.getAcPrivilege().getCode() + "_" +
						acPermission.getAcObject().getDomainModelId() + "_" +
						acPermission.getAcObject().getObjectClass())
				).collect(Collectors.toList()))
			);
		}
    	return authorities;
	}

	private static List<String> setGroups(final User user){
    	List<String> groups = user.getGroups().stream().map(group -> group.getName()).collect(Collectors.toList());
    	return groups;
	}

}
