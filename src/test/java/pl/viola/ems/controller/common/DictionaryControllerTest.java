package pl.viola.ems.controller.common;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.service.common.DictionaryService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DictionaryControllerTest {
    @Autowired
    WebApplicationContext context;

    @MockBean
    DictionaryService dictionaryService;

    private MockMvc mvc;
    final private Dictionary asort = new Dictionary("asort", "Asortyment", 'S', null);
    final private Dictionary test = new Dictionary("test", "Test", 'U', new HashSet<>());
    final private Dictionary user = new Dictionary("user", "Użytkownik", 'A', new HashSet<>());
    final private DictionaryItem item = new DictionaryItem((long) 1, "test", "test item", true, asort, new HashSet<>(), new HashSet<>(), new HashSet<>(), new HashSet<>());

    final private List<Dictionary> all = Arrays.asList(asort, test, user);
    final private Set<DictionaryItem> items = new HashSet<>();
    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        items.add(item);
        asort.setItems(items);
    }

    @WithMockUser("user")
    @DisplayName("Dictionary - Controller - getAllDictionaries")
    @Test
    void getAllDictionaries() throws Exception{
        given(dictionaryService.findAll()).willReturn(all);

        mvc.perform(get("/api/dict/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[1].code").value("test"));
    }

    @WithMockUser("user")
    @DisplayName("Dictionary - Controller - getDictionaryById")
    @Test
    void getDictionary() throws Exception{
        given(dictionaryService.findById("asort")).willReturn(java.util.Optional.of(asort));

        mvc.perform(get("/api/dict/getDict/asort")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FOUND"))
                .andExpect(jsonPath("$.data.code").value(asort.getCode()));
    }
}