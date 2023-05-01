const Parser = require('web-tree-sitter');

(async () => {
  await Parser.init();
  const parser = new Parser();
  const Lang = await Parser.Language.load('../tree-sitter-eventrule/tree-sitter-eventrule.wasm');
  
  parser.setLanguage(Lang);
  
  const eventRuleToGherkin = (eventRule) => {
    const eventRuleJson = JSON.parse(eventRule);
    const tree = parser.parse(eventRule);
    const rootNode = tree.rootNode;
    console.log(rootNode.toString());
    
    const eventSource = eventRuleJson.source[0];
    const detailType = eventRuleJson['detail-type'][0];
    const eventNameDetail = eventRuleJson.detail.eventName[0];
    const gherkin = `
    Feature: ${eventSource} ${detailType}
        Scenario: ${eventSource} ${detailType}
            Given the ${eventSource} service
            When the ${eventNameDetail} API is called
            Then alert the SOC
    `;
    return gherkin;
  };
  
  const eventRule = `
  {
    "source": [
      "aws.s3"
    ],
    "detail-type": [
      "AWS API Call via CloudTrail"
    ],
    "detail": {
      "eventSource": [
        "s3.amazonaws.com"
      ],
      "eventName": [
        "CreateBucket",
        "PutBucketPublicAccessBlock"
      ]
    }
  }`;
  console.log(eventRuleToGherkin(eventRule));
})();