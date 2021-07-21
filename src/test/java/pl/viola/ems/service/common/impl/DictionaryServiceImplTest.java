package pl.viola.ems.service.common.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.common.dictionary.repository.DictionaryRepository;
import pl.viola.ems.service.common.DictionaryService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DictionaryServiceImplTest {

    @TestConfiguration
    static class DictionaryServiceImplTestContexConfiguration{
        @Bean
        public DictionaryService dictionaryService(){ return  new DictionaryServiceImpl(); }
    }

    @Autowired
    private DictionaryService dictionaryService;

    @MockBean
    private DictionaryRepository dictionaryRepository;

    @BeforeEach
    void setUp(){
        Dictionary asorty = new Dictionary("asort", "Asortyment", 'S', new HashSet<DictionaryItem>());
        Dictionary test = new Dictionary("test", "Test", 'U',new HashSet<DictionaryItem>());
        Dictionary user = new Dictionary("user", "Użytkownik", 'A', new HashSet<DictionaryItem>());

        List<Dictionary> dict = new ArrayList<Dictionary>();
        dict.add(asorty);
        dict.add(test);
        dict.add(user);

        Mockito.when(dictionaryRepository.findAll()).thenReturn(dict);
        Mockito.when(dictionaryRepository.findById("asort")).thenReturn(Optional.of(asorty));
    }

    @DisplayName("Test Dictionary - Services - findAll")
    @Test
    void findAll() {
        List<Dictionary> all = dictionaryService.findAll();

        assertThat(all).isNotEmpty();
        assertThat(all.size()).isGreaterThanOrEqualTo(1);
        assertThat(all.get(0).getCode()).isEqualTo("asort");
    }

    @DisplayName("Test Dictionary - Services - findByCode")
    @Test
    void findById() {
        Dictionary asort = new Dictionary("asort", "Asortyment", 'S', new HashSet<DictionaryItem>());

        Optional<Dictionary> dict = dictionaryService.findById("asort");
        assertThat(dict.get()).isNotNull();
        assertThat(dict.get()).isEqualTo(asort);
        assertThat(dict.get().getType()).isEqualTo('S');
    }
}