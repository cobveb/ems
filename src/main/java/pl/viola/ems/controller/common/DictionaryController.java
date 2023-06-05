package pl.viola.ems.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.payload.api.ApiResponse;
import pl.viola.ems.service.common.DictionaryService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/dict")
public class DictionaryController {

    @Autowired
    DictionaryService dictionaryService;

    @GetMapping("/getAll")
    public ApiResponse getAllDictionaries() {
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findAll());
    }

    @GetMapping("/getDict/{code}")
    public ApiResponse getDictionary(@PathVariable String code) {
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findById(code));
    }

    @GetMapping("/getDictItems/{code}")
    public ApiResponse getDictionaryActiveItems(@PathVariable String code) {
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findActiveItemsByDictionary(code));
    }

    @GetMapping("/getDictModule/{module}")
    public ApiResponse getDictionaryByModule(@PathVariable String module) {
        return new ApiResponse(HttpStatus.FOUND, dictionaryService.findByModule(module));
    }

    @PutMapping("/{dictCode}/saveDictItem")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('1033','2116')")
    public ApiResponse saveDictionaryItem(@RequestBody @Valid DictionaryItem dictionaryItem, @PathVariable String dictCode) {
        return new ApiResponse(HttpStatus.CREATED, dictionaryService.saveDictionaryItem(dictionaryItem, dictCode));
    }

    @DeleteMapping("/deleteItem/{itemId}")
    @PreAuthorize("hasGroup('admin') or hasAnyPrivilege('2033','3116')")
    public ApiResponse deleteItem(@PathVariable Long itemId) {
        return new ApiResponse(HttpStatus.ACCEPTED, dictionaryService.deleteDictionaryItem(itemId));
    }
}

