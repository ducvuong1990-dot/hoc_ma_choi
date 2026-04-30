#!/usr/bin/env node

/**
 * Test script for Development Multi-Agent System
 */

const { DevOrchestrator } = require('./dev_agents');
const fs = require('fs');
const path = require('path');

async function testTestingAgent() {
  console.log("🧪 Test 1: Testing Agent\n");

  try {
    const orchestrator = new DevOrchestrator();
    await orchestrator.runAgent('test');
    console.log("✅ Test 1 PASSED");
    return true;
  } catch (error) {
    console.error("❌ Test 1 FAILED:", error.message);
    return false;
  }
}

async function testRefactoringAgent() {
  console.log("\n🧪 Test 2: Refactoring Agent\n");

  try {
    const orchestrator = new DevOrchestrator();
    await orchestrator.runAgent('refactor');
    console.log("✅ Test 2 PASSED");
    return true;
  } catch (error) {
    console.error("❌ Test 2 FAILED:", error.message);
    return false;
  }
}

async function testDocumentationAgent() {
  console.log("\n🧪 Test 3: Documentation Agent\n");

  try {
    const orchestrator = new DevOrchestrator();
    await orchestrator.runAgent('docs');
    console.log("✅ Test 3 PASSED");
    return true;
  } catch (error) {
    console.error("❌ Test 3 FAILED:", error.message);
    return false;
  }
}

async function testSecurityAgent() {
  console.log("\n🧪 Test 4: Security Agent\n");

  try {
    const orchestrator = new DevOrchestrator();
    await orchestrator.runAgent('security');
    console.log("✅ Test 4 PASSED");
    return true;
  } catch (error) {
    console.error("❌ Test 4 FAILED:", error.message);
    return false;
  }
}

async function testCodeReviewAgent() {
  console.log("\n🧪 Test 5: Code Review Agent\n");

  try {
    const orchestrator = new DevOrchestrator();
    await orchestrator.runAgent('review');
    console.log("✅ Test 5 PASSED");
    return true;
  } catch (error) {
    console.error("❌ Test 5 FAILED:", error.message);
    return false;
  }
}

async function runAllTests() {
  console.log("=" .repeat(60));
  console.log("🧪 DEVELOPMENT AGENTS TEST SUITE");
  console.log("=".repeat(60) + "\n");

  const startTime = Date.now();
  const results = [];

  // Run tests
  results.push(await testTestingAgent());
  results.push(await testRefactoringAgent());
  results.push(await testDocumentationAgent());
  results.push(await testSecurityAgent());
  results.push(await testCodeReviewAgent());

  const totalTime = Date.now() - startTime;
  const passed = results.filter(r => r).length;
  const failed = results.length - passed;

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log("=".repeat(60) + "\n");

  if (failed === 0) {
    console.log("🎉 ALL TESTS PASSED!\n");
    process.exit(0);
  } else {
    console.log("⚠️  SOME TESTS FAILED\n");
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { runAllTests };
