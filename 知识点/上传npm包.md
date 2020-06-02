## 上传NPM包流程如下所示：

- 使用vue-cli新建一个vue项目，在项目根路径下新建一个packages文件夹，将所有的组定义组件放到packages文件夹中，在packages文件夹中新建一个index.js文件，index.js文件夹中导出install函数，这是vue插件必须具有的一个函数。
- 使用到的字体文件， 也需要一同拷贝到packages文件夹中
- 先使用vue提供的对自定义组件进行打包的命令将组件进行打包

- 上传到npm之前，需要先建立一个.npmignore文件，指定要忽略的文件和文件夹，不上传到npm上
- 需要先执行 npm login 命令，登录之后才能进行上传
- npm publish 命令，将指定的包上传到npm中