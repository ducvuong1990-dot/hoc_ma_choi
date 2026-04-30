# 🛠️ Development Multi-Agent System

## 📋 Tổng quan

Hệ thống **6 agents** chuyên biệt cho phát triển và bảo trì code:

```
┌─────────────────────────────────────────────────────────┐
│              Development Agent Orchestrator              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Testing    │    │ Refactoring  │    │Documentation │
└──────────────┘    └──────────────┘    └──────────────┘
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Optimization  │    │  Security    │    │Code Review   │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🎯 Các Agents

### 1. **Testing Agent**
**Nhiệm vụ:** Tự động tạo và chạy unit tests

**Chức năng:**
- Tìm files chưa có tests
- Tạo test files với templates
- Chạy test suites
- Báo cáo coverage

**Output:**
```
📊 Testing Report
Files without tests: 3
- auto_generate_lesson.js
- multi_agent_lesson_gen.js
- dev_agents.js

Test files created: 3
Test results: 15 passed, 2 failed
Coverage: 78%
```

---

### 2. **Refactoring Agent**
**Nhiệm vụ:** Phân tích code và đề xuất refactoring

**Kiểm tra:**
- ✅ Cyclomatic complexity
- ✅ Code duplication
- ✅ Magic numbers
- ✅ Long functions (>50 lines)
- ✅ Deep nesting (>3 levels)

**Output:**
```
🔧 Refactoring Suggestions

High Priority:
- auto_generate_lesson.js:45 - Function too long (87 lines)
- multi_agent_lesson_gen.js:123 - Cyclomatic complexity: 12
- generate_audio.py:34 - Duplicated code block

Medium Priority:
- dev_agents.js:234 - Magic number: 0.42
```

---

### 3. **Documentation Agent**
**Nhiệm vụ:** Tạo và cập nhật documentation

**Chức năng:**
- Generate API docs
- Add JSDoc comments
- Update README.md
- Create usage examples

**Output:**
```
📚 Documentation Generated

API Documentation:
- docs/api/auto_generate_lesson.md
- docs/api/multi_agent_lesson_gen.md

JSDoc Comments Added:
- 45 functions documented
- 12 classes documented

README.md Updated:
- Added API reference section
- Added usage examples
```

---

### 4. **Optimization Agent**
**Nhiệm vụ:** Tìm và fix performance issues

**Phân tích:**
- Bundle size analysis
- Performance bottlenecks
- Memory leaks
- Unused dependencies

**Output:**
```
⚡ Optimization Report

Bundle Size: 2.3 MB
Largest dependencies:
- node_modules/some-lib: 800 KB (unused)

Performance Issues:
- auto_generate_lesson.js:234 - Blocking I/O
- multi_agent_lesson_gen.js:456 - Inefficient loop

Memory Leaks:
- dev_agents.js:123 - Event listener not removed
```

---

### 5. **Security Agent**
**Nhiệm vụ:** Scan vulnerabilities và security issues

**Kiểm tra:**
- ✅ Known vulnerabilities in dependencies
- ✅ Hardcoded secrets
- ✅ SQL injection risks
- ✅ XSS vulnerabilities
- ✅ Path traversal
- ✅ Dangerous functions (eval, exec)

**Output:**
```
🔒 Security Scan Report

Critical Issues: 0
High Priority: 2
- auto_generate_lesson.js:67 - Potential path traversal
- generate_audio.py:89 - Unsafe file operations

Medium Priority: 3
- Outdated dependency: lodash@4.17.15

Secrets Found: 0
```

---

### 6. **Code Review Agent**
**Nhiệm vụ:** Review code changes và đưa feedback

**Đánh giá:**
- Code style consistency
- Best practices
- Error handling
- Test coverage
- Documentation

**Output:**
```
📝 Code Review

Overall Score: 8.5/10

✅ Strengths:
- Good error handling
- Comprehensive tests
- Clear documentation

⚠️ Improvements Needed:
- Inconsistent naming conventions
- Missing input validation in 2 functions
- Consider adding more edge case tests

Detailed Feedback:
- Line 45: Use const instead of let
- Line 123: Extract magic number to constant
- Line 234: Add JSDoc comment
```

---

## 🚀 Sử dụng

### Cách 1: Command Line

```bash
# Chạy từng agent
node dev_agents.js test        # Testing agent
node dev_agents.js refactor    # Refactoring agent
node dev_agents.js docs        # Documentation agent
node dev_agents.js optimize    # Optimization agent
node dev_agents.js security    # Security agent
node dev_agents.js review      # Code review agent

# Chạy tất cả agents
node dev_agents.js all
```

### Cách 2: Import vào code

```javascript
const { DevOrchestrator } = require('./dev_agents');

async function main() {
  const orchestrator = new DevOrchestrator();
  
  // Chạy một agent
  await orchestrator.runAgent('security');
  
  // Chạy tất cả
  await orchestrator.runAll();
}

main();
```

### Cách 3: Automated CI/CD

```yaml
# .github/workflows/dev-agents.yml
name: Development Agents

on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node dev_agents.js all
```

---

## 📊 Output Examples

### Testing Agent Output
```
🧪 Testing Agent Starting...

Scanning for files without tests...
Found 3 files:
  ✓ auto_generate_lesson.js
  ✓ multi_agent_lesson_gen.js
  ✓ dev_agents.js

Creating test files...
  ✓ Created test/auto_generate_lesson.test.js
  ✓ Created test/multi_agent_lesson_gen.test.js
  ✓ Created test/dev_agents.test.js

Running tests...
  ✓ auto_generate_lesson.test.js (5 tests, 5 passed)
  ✓ multi_agent_lesson_gen.test.js (8 tests, 7 passed, 1 failed)
  ✓ dev_agents.test.js (12 tests, 12 passed)

Coverage: 78%
```

### Security Agent Output
```
🔒 Security Agent Starting...

Scanning dependencies...
  ✓ Checking npm audit...
  ✓ Checking for known vulnerabilities...

Scanning source code...
  ✓ Checking for hardcoded secrets...
  ✓ Checking for dangerous functions...
  ✓ Checking for path traversal...

Results:
  Critical: 0
  High: 2
  Medium: 3
  Low: 5

Details saved to: security-report.json
```

---

## 🔧 Configuration

```javascript
// dev_agents.config.js
module.exports = {
  testing: {
    framework: 'jest',
    coverage: 80,
    testDir: 'test'
  },
  refactoring: {
    maxComplexity: 10,
    maxFunctionLength: 50,
    maxNesting: 3
  },
  documentation: {
    style: 'jsdoc',
    includeExamples: true,
    outputDir: 'docs'
  },
  optimization: {
    maxBundleSize: '5MB',
    checkMemoryLeaks: true
  },
  security: {
    scanDependencies: true,
    scanSecrets: true,
    failOnCritical: true
  },
  review: {
    minScore: 7.0,
    checkStyle: true,
    checkTests: true
  }
};
```

---

## 🎯 Best Practices

### 1. Run Before Commit
```bash
# Pre-commit hook
#!/bin/bash
node dev_agents.js security
node dev_agents.js test
```

### 2. Scheduled Runs
```bash
# Cron job - chạy mỗi ngày lúc 2am
0 2 * * * cd /path/to/project && node dev_agents.js all
```

### 3. CI/CD Integration
```yaml
# Run on every PR
on:
  pull_request:
    branches: [main]

jobs:
  dev-agents:
    runs-on: ubuntu-latest
    steps:
      - run: node dev_agents.js all
      - run: |
          if [ $? -ne 0 ]; then
            echo "Quality checks failed"
            exit 1
          fi
```

---

## 🔮 Future Enhancements

### 1. AI-Powered Suggestions
```javascript
class RefactoringAgent {
  async suggestWithAI(code) {
    // Use Gemini API to suggest refactoring
    const suggestions = await gemini.analyze(code);
    return suggestions;
  }
}
```

### 2. Auto-Fix Mode
```javascript
// Auto-fix simple issues
node dev_agents.js refactor --auto-fix
node dev_agents.js security --auto-fix
```

### 3. Interactive Mode
```javascript
// Interactive prompts for decisions
node dev_agents.js review --interactive
```

---

## 📝 Notes

- Development agents complement lesson generation agents
- Run regularly for code quality maintenance
- Integrate with CI/CD for automated checks
- Review agent suggestions before applying
- Keep configuration updated with project needs

---

**Created by:** Claude Sonnet 4  
**Date:** 2026-04-30  
**Version:** 1.0.0
