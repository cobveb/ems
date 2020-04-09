package pl.viola.ems.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.common.DictionaryService;

@RestController
@RequestMapping("/api/dict")
public class DictionaryController {

    @Autowired
    DictionaryService dictionaryService;

    @GetMapping("getAll")
    public ApiResponse getAllDictionaries(){
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findAll());
    }

    @GetMapping("/getDict/{code}")
    public ApiResponse getDictionary(@PathVariable String code){
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findById(code));
    }
}

