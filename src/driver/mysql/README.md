
本目录包含原始捆绑驱动程序的源代码，以及由 `edgeworkerizer.py` 创建的工件，以使其能够在 Cloudflare Workers 上运行。

### 捆绑 Deno MySQL 驱动程序

```sh
deno bundle https://deno.land/x/mysql@v2.10.1/mod.ts > mysql.js.deno
python3 ../edgeworkerizer.py mysql.js.deno > index.js
cp *.wasm ../../../dist/
