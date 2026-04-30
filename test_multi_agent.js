#!/usr/bin/env node

/**
 * Test script for Multi-Agent Lesson Generation
 */

const { generateLessonMultiAgent } = require('./multi_agent_lesson_gen');

async function testSingleLesson() {
  console.log("🧪 Test 1: Single Lesson Generation\n");

  try {
    const result = await generateLessonMultiAgent("Vòng đời của ếch", 1);
    console.log("✅ Test 1 PASSED");
    console.log(`   Output: ${result.outputDir}`);
    return true;
  } catch (error) {
    console.error("❌ Test 1 FAILED:", error.message);
    return false;
  }
}

async function testBatchGeneration() {
  console.log("\n🧪 Test 2: Batch Generation (3 lessons)\n");

  const topics = [
    "Chu kỳ nước",
    "Hệ mặt trời",
    "Cây xanh và không khí"
  ];

  let passed = 0;
  let failed = 0;

  for (const topic of topics) {
    try {
      await generateLessonMultiAgent(topic, 1);
      passed++;
      console.log(`✅ ${topic} - PASSED`);
    } catch (error) {
      failed++;
      console.error(`❌ ${topic} - FAILED: ${error.message}`);
    }
  }

  console.log(`\n📊 Batch Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

async function testDifferentGrades() {
  console.log("\n🧪 Test 3: Different Grades\n");

  const tests = [
    { topic: "Đếm số từ 1-10", grade: 1 },
    { topic: "Phân số thập phân", grade: 5 }
  ];

  let passed = 0;

  for (const test of tests) {
    try {
      await generateLessonMultiAgent(test.topic, test.grade);
      passed++;
      console.log(`✅ Grade ${test.grade}: ${test.topic} - PASSED`);
    } catch (error) {
      console.error(`❌ Grade ${test.grade}: ${test.topic} - FAILED: ${error.message}`);
    }
  }

  return passed === tests.length;
}

async function testErrorHandling() {
  console.log("\n🧪 Test 4: Error Handling\n");

  try {
    // Test với topic rỗng
    await generateLessonMultiAgent("", 1);
    console.error("❌ Test 4 FAILED: Should have thrown error for empty topic");
    return false;
  } catch (error) {
    console.log("✅ Test 4 PASSED: Correctly handled empty topic");
    return true;
  }
}

async function runAllTests() {
  console.log("=" .repeat(60));
  console.log("🧪 MULTI-AGENT SYSTEM TEST SUITE");
  console.log("=".repeat(60) + "\n");

  const startTime = Date.now();
  const results = [];

  // Run tests
  results.push(await testSingleLesson());
  results.push(await testBatchGeneration());
  results.push(await testDifferentGrades());
  results.push(await testErrorHandling());

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
