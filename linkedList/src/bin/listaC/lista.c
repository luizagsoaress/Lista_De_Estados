#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct NO{
char *info;
struct NO *prox; 
struct NO *ant;
}NO;

typedef NO *LISTA;

LISTA *crialista();
NO *alocarNO();
int listaVazia(LISTA *l);
void adicionar(LISTA *l, char *elemento);
void contrario(LISTA *l);
void deletar(LISTA *l, char *elemento);
int verificaExistencia(LISTA *l, char *elemento);
int tamanho(LISTA *l);
void imprime(LISTA *l);

LISTA *crialista(){
LISTA *l = (LISTA*)malloc(sizeof(LISTA));
if(!l) printf("Erro na alocacao da linkedList");
*l = NULL;
return l;
}

NO *alocarNO(){
return (NO*)malloc(sizeof(NO));
}

int listaVazia(LISTA *l){
return (*l == NULL);
}

void adicionar(LISTA *l, char *elemento) {
NO *aux = *l;
NO *novo = alocarNO();
novo->info = malloc(strlen(elemento) + 1);
strcpy(novo->info, elemento);
novo->prox = NULL;
novo->ant = NULL;
if (listaVazia(l)) {
*l = novo;
return;
}
if (strcmp(elemento, aux->info) < 0) {
novo->prox = aux;
aux->ant = novo;
*l = novo;
return;
}
while (aux->prox != NULL && strcmp(aux->prox->info, elemento) < 0) {
aux = aux->prox;
}
if (strcmp(aux->info, elemento) == 0) {
free(novo->info);
free(novo);
return; 
}
novo->prox = aux->prox;
novo->ant = aux;
if (aux->prox != NULL) {
aux->prox->ant = novo;
}
aux->prox = novo;
}

void contrario(LISTA *l){
if (listaVazia(l)) return;
NO *aux = *l;
NO *temp = NULL;
while(aux != NULL){
temp = aux->prox;
aux->prox = aux->ant;
aux->ant = temp;
if(aux->ant == NULL){ 
*l = aux;
}
aux = aux->ant; 
}
}

void deletar(LISTA *l, char *elemento){
NO *aux = *l;
if(listaVazia(l)) return;

while(aux != NULL){
if(strcmp(aux->info, elemento) == 0){
if(aux->ant != NULL){
aux->ant->prox = aux->prox;
}
else{
*l = aux->prox;
}
if(aux->prox != NULL){
aux->prox->ant = aux->ant;
}
free(aux->info);
free(aux);
return;
}
aux = aux->prox;
}
}

int verificaExistencia(LISTA *l, char *elemento){
NO *aux = *l;
if(listaVazia(l)) return 0;

while(aux != NULL){
if(strcmp(aux->info, elemento) == 0){
return 1;
}
aux = aux->prox;
}
return 0;
}

int tamanho(LISTA *l){
NO *aux = *l;
if(listaVazia(l)) return 0;

int count = 0;
while(aux != NULL){
count++;
aux = aux->prox;
}
return count;
}

void imprime(LISTA *l){
    if(listaVazia(l)) return;
    NO *aux = *l;
    while(aux != NULL){
        printf("%s", aux->info);
        if(aux->prox != NULL) printf(","); 
        aux = aux->prox;
    }
    printf("\n");
    fflush(stdout);
}


int main(int argc, char* argv[]) {
    LISTA *l = crialista(); 
    for (int i = 1; i < argc; i++) {
        adicionar(l, argv[i]);
    }
    imprime(l); 
    return 0;
}
