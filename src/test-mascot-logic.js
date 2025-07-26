// Test script to verify mascot logic
// Run this in browser console to test different scenarios

function testMascotLogic() {
  console.log('🧪 TESTING MASCOT LOGIC\n');
  
  // Test scenarios
  const scenarios = [
    {
      name: 'Loading State',
      isLoading: true,
      lastCompletionDate: null,
      recentlyCompleted: false,
      expected: 'encouraging'
    },
    {
      name: 'Recently Completed',
      isLoading: false,
      lastCompletionDate: new Date().toISOString(),
      recentlyCompleted: true,
      expected: 'celebration'
    },
    {
      name: 'Active (within 24 hours)',
      isLoading: false,
      lastCompletionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      recentlyCompleted: false,
      expected: 'encouraging'
    },
    {
      name: 'Inactive (50 hours ago)',
      isLoading: false,
      lastCompletionDate: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
      recentlyCompleted: false,
      expected: 'sad'
    },
    {
      name: 'No completion date',
      isLoading: false,
      lastCompletionDate: null,
      recentlyCompleted: false,
      expected: 'sad'
    }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n📋 Testing: ${scenario.name}`);
    
    // Simulate isRecentlyActive logic
    const isRecentlyActive = () => {
      if (scenario.isLoading) return true;
      if (!scenario.lastCompletionDate) return false;
      const diffHours = (new Date() - new Date(scenario.lastCompletionDate)) / (1000 * 60 * 60);
      return diffHours <= 48;
    };
    
    // Simulate shouldShowSadState logic
    const shouldShowSadState = !scenario.isLoading && !isRecentlyActive() && !scenario.recentlyCompleted;
    
    // Determine expected result
    let actualResult;
    if (scenario.recentlyCompleted) {
      actualResult = 'celebration';
    } else if (shouldShowSadState) {
      actualResult = 'sad';
    } else {
      actualResult = 'encouraging';
    }
    
    const passed = actualResult === scenario.expected;
    console.log(`   isLoading: ${scenario.isLoading}`);
    console.log(`   lastCompletionDate: ${scenario.lastCompletionDate}`);
    console.log(`   recentlyCompleted: ${scenario.recentlyCompleted}`);
    console.log(`   isRecentlyActive: ${isRecentlyActive()}`);
    console.log(`   shouldShowSadState: ${shouldShowSadState}`);
    console.log(`   Expected: ${scenario.expected}, Got: ${actualResult}`);
    console.log(`   ✅ ${passed ? 'PASS' : '❌ FAIL'}`);
  });
}

// Export for use
window.testMascotLogic = testMascotLogic;
console.log('💻 Test ready! Run testMascotLogic() in console');
