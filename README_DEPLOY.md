# Deploy do Projeto no Vercel

## 📋 Arquivos Criados/Modificados

1. **vercel.json** - Configuração do deploy no Vercel
2. **vite.config.js** - Configuração do build Vite
3. **.env.production** - Variáveis de ambiente de produção
4. **index.html** - Caminhos de arquivos ajustados para relativos

## 🚀 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Inicializar Git (se ainda não tiver)
git init
git add .
git commit -m "Preparado para deploy no Vercel"

# Conectar ao repositório GitHub
git remote add origin https://github.com/seu-usuario/bragabmx.git
git push -u origin main
```

### 2. Configurar no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `bragabmx`
5. Configure as opções:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Clique em "Deploy"

### 3. Testar o Build Localmente

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Testar o build
npm run preview
```

Acesse `http://localhost:4173` para verificar se tudo funciona corretamente.

## ⚠️ Pontos Importantes

- Todos os caminhos de arquivos foram convertidos de absolutos (`/src/`) para relativos (`./src/`)
- O Vite está configurado com `base: './'` para garantir caminhos relativos
- O Vercel está configurado para SPA routing com regras de rewrite
- O build será otimizado para produção com minificação

## 🔧 Configurações Técnicas

### vercel.json
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- Rewrite rules para SPA routing

### vite.config.js
- Base path relativo: `'./'`
- Output directory: `dist`
- Source maps habilitados
- Input: `./index.html`

### .env.production
- NODE_ENV=production

## 📝 Pós-Deploy

Após o deploy:
1. Verifique se todas as imagens carregam corretamente
2. Teste as animações com GSAP
3. Verifique se o jogo BMX funciona
4. Teste o vídeo na seção de contato
5. Verifique a responsividade em diferentes dispositivos

## 🌐 Domínio Personalizado (Opcional)

1. No painel do Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure o DNS conforme as instruções do Vercel
4. Aguarde a propagação do DNS

## 🔄 Deploy Automático

O Vercel configurará deploy automático sempre que você:
- Fizer push para a branch main
- Abrir um pull request
- Fizer merge de um pull request

## 🐛 Solução de Problemas

### Imagens não carregam
- Verifique se os caminhos no HTML estão relativos
- Confirme se os arquivos existem na pasta `src/img/`

### Animações não funcionam
- Verifique se o GSAP está carregando corretamente
- Confirme se o ScrollTrigger está sendo inicializado após o carregamento

### Erros de build
- Verifique o log de build no Vercel
- Teste localmente com `npm run build`
- Verifique se todas as dependências estão no package.json