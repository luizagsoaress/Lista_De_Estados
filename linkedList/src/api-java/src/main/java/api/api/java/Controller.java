package api.api.java;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

import org.springframework.web.bind.annotation.*;

@RestController
public class Controller{
    
    public static class ItensRequest {
    private List<String> itens;

    public List<String> getItens() { return itens; }
    public void setItens(List<String> itens) { this.itens = itens; }
    }


    @PostMapping("/ordenar")
    public List<String> ordenar(@RequestBody ItensRequest request) throws IOException, InterruptedException {
    List<String> itens = request.getItens();
    List<String> resultado = new ArrayList<>();

    List<String> comando = new ArrayList<>();
    comando.add("/xxxx/xxxx/xxxx/xxxx/listaC/lista");
    comando.addAll(itens);

    ProcessBuilder pb = new ProcessBuilder(comando);
    Process process = pb.start();

    try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(process.getInputStream()))) {
        String linha;
        while ((linha = reader.readLine()) != null) {
           if (linha != null && !linha.trim().isEmpty()) {
           String[] nomes = linha.split(","); 
           resultado.addAll(Arrays.asList(nomes));
        }
      }
    }

    process.waitFor();
    return resultado;
}

}