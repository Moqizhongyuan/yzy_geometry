module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'ci', // 配置文件更新、CI 工具设置的更改。
        'feat', //  新增一个新功能、模块或组件。
        'fix', // 修复已知的错误或问题。
        'docs', // 更新 README 文件、添加 API 文档、注释代码。
        'style', // 格式化代码、修改缩进、删除多余的空行。
        'refactor', // 改进代码结构、抽象出函数、优化代码的可读性和维护性。
        'perf', // 对算法、逻辑、数据库查询等进行性能优化。
        'test', // 添加单元测试、集成测试，修改现有测试。
        'chore', // 例如更新依赖、构建脚本的修改，配置文件更新等。
        'revert', // 因为某个提交引入了错误，进行撤回。
        'release'
      ]
    ]
  }
}
