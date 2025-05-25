export default defineConfig({
  plugins: [react()],
  root: '.',             // これでプロジェクトルートが明示
  publicDir: 'public'    // public内のindex.htmlやiconがビルドに含まれる
});
