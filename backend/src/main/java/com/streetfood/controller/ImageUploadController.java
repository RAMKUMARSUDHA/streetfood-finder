package com.streetfood.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;
@RestController @RequestMapping("/api/upload")
public class ImageUploadController {
    private final String uploadDir="uploads/";
    @PostMapping("/vendor-photo") public ResponseEntity<?> photo(@RequestParam("file") MultipartFile file){return save(file,"vendors");}
    @PostMapping("/vendor-logo")  public ResponseEntity<?> logo(@RequestParam("file") MultipartFile file){return save(file,"logos");}
    private ResponseEntity<?> save(MultipartFile file,String folder){
        try{
            if(file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message","No file"));
            if(file.getContentType()==null||!file.getContentType().startsWith("image/")) return ResponseEntity.badRequest().body(Map.of("message","Images only"));
            if(file.getSize()>5*1024*1024) return ResponseEntity.badRequest().body(Map.of("message","Max 5MB"));
            String dir=uploadDir+folder; new File(dir).mkdirs();
            String orig=file.getOriginalFilename(); String ext=orig!=null&&orig.contains(".")?orig.substring(orig.lastIndexOf(".")):".jpg";
            String filename=UUID.randomUUID()+ext;
            Files.write(Paths.get(dir,filename),file.getBytes());
            return ResponseEntity.ok(Map.of("url","/uploads/"+folder+"/"+filename,"filename",filename));
        }catch(Exception e){return ResponseEntity.internalServerError().body(Map.of("message","Upload failed"));}
    }
}
