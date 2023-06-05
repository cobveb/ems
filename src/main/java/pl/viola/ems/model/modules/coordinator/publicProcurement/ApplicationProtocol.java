package pl.viola.ems.model.modules.coordinator.publicProcurement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.viola.ems.model.common.Text;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.administrator.User;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(exclude = {"prices", "application"})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cor_pub_proc_protocol", schema = "emsadm")
public class ApplicationProtocol {

    public enum ProtocolStatus {
        ZP, WY, AZ, AK, ZA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "publicApplicationProtocolSequence")
    @SequenceGenerator(name = "publicApplicationProtocolSequence", sequenceName = "cor_pub_proc_apl_protocol_seq", schema = "emsadm", allocationSize = 1)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ApplicationProtocol.ProtocolStatus status;

    private Boolean email;

    private Boolean phone;

    private Boolean internet;

    private Boolean paper;

    private Boolean other;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "other_desc_id", referencedColumnName = "id")
    private Text otherDesc;

    private Boolean renouncement;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "non_comp_id", referencedColumnName = "id")
    private Text nonCompetitiveOffer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "received_offers_id", referencedColumnName = "id")
    private Text receivedOffers;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "just_choosing_off_id", referencedColumnName = "id")
    private Text justificationChoosingOffer;

    @ManyToOne
    @JoinColumn(name = "send_user_id")
    private User sendUser;

    @ManyToOne
    @JoinColumn(name = "public_accept_user_id")
    private User publicAcceptUser;

    @ManyToOne
    @JoinColumn(name = "accountant_accept_user_id")
    private User accountantAcceptUser;

    @ManyToOne
    @JoinColumn(name = "chief_accept_user_id")
    private User chiefAcceptUser;

    @JsonIgnore
    @OneToOne(mappedBy = "applicationProtocol")
    @ToString.Exclude
    private Application application;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contractor_desc_id", referencedColumnName = "id")
    private Text contractorDesc;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "applicationProtocol", cascade = {CascadeType.ALL})
    @ToString.Exclude
    private Set<ApplicationProtocolPrice> prices = new HashSet<>();

}
