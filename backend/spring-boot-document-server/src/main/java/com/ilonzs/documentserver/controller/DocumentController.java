package com.ilonzs.documentserver.controller;

import com.ilonzs.documentserver.model.Paragraph;
import com.thedeanda.lorem.Lorem;
import com.thedeanda.lorem.LoremIpsum;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class DocumentController {

    private static int documentLength;
    private static Map<Integer, Paragraph> document;
    static {
        documentLength = 10000000;
        document = new HashMap<Integer, Paragraph>();
    }

    @RequestMapping(value = "/document/length")
    public int getDocumentLength() {
        return documentLength;
    }

    @RequestMapping(value = "/document")
    public @ResponseBody List<Paragraph> getDocument(@RequestParam int offset, @RequestParam int count) {
        Lorem lorem = LoremIpsum.getInstance();
        int paragraphCount = Math.min(500, count);

        List<Paragraph> result = new ArrayList<>();
        for (int i = 0; i < paragraphCount; i++) {
            int id = offset + i;
            if (id == documentLength) break;
            Paragraph resultToAdd = document.get(id);
            if (resultToAdd == null) {
                resultToAdd = new Paragraph(id, lorem.getHtmlParagraphs(1, 1));
                document.put(id, resultToAdd);
            }
            result.add(resultToAdd);
        }
        return result;
    }
}
