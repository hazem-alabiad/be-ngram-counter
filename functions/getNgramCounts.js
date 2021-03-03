exports.handler = (event, context, callback) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  };

  // ##################   Helpers    ##################
  const send = (body) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: headers,
    });
  };

  /**
   * @param {String} body
   * @param {Boolean} case_sensitive
   * @param {String} ngram
   * @param {String} length
   */
  const getNgramCounts = (body, case_sensitive, ngram, length) => {
    ngram = parseInt(ngram);
    length = parseInt(length);
    // Filter out white spaces
    body = body.split(/\s/).join("");

    var ngramCountsObj = {};
    var ngramCountsArr = [];

    // If case_sensitive is set to False convert all letter to uppercase
    if (!case_sensitive) body = body.toUpperCase();

    for (let i = 0; i <= body.length - ngram; i++) {
      const str = body.substring(i, i + ngram);
      // For each ngram:
      // if ngram exists in ngramCounts: add to ngram to ngramCounts with count: 1
      // otherwise: add ngram to ngramCounts with count++
      if (str in ngramCountsObj) {
        ngramCountsObj[str]++;
      } else {
        ngramCountsObj[str] = 1;
      }
    }
    // Convert ngramCounts to array of objects of the format [{ ngram: "hk", count: 2 }, ...]
    for (ngram in ngramCountsObj)
      ngramCountsArr.push({ ngram, count: ngramCountsObj[ngram] });

    // sort according to `count` values in descendent order
    ngramCountsArr.sort((a, b) => b.count - a.count);

    // return ngram counts according to length
    return ngramCountsArr.slice(0, length);
  };

  // Handle the error where no data was sent
  if (!event.body)
    return callback(null, {
      statusCode: 400,
      errorMessage: "The request is missing data!",
      headers: headers,
    });

  // ############   Check API call type    #############
  if (event.httpMethod === "POST") {
    // get data from FE app by: event.body
    const { body, case_sensitive, ngram, length } = JSON.parse(event.body);
    send(getNgramCounts(body, case_sensitive, ngram, length));
  }
};
