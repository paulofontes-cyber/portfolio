public class No {
    private String chave;
    private String valor;
    private No proximo;

    public No(String chave, String valor) {
        this.chave = chave;
        this.valor = valor;
        this.proximo = null;
    }

    public String getChave() {
        return chave;
    }

    public String getValor() {
        return valor;
    }

    public No getProximo() {
        return proximo;
    }

    public void setProximo(No proximo) {
        this.proximo = proximo;
    }
}
