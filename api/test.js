const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
axios.get('https://oa-idaas.jasolar.com:19094//api/bff/v1.2/enduser/portal/sso/go_206632282fe963878b4fe864ab0d931fEVpRJYJKp2R?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZW50ZXJwcmlzZV9tb2JpbGVfcmVzb3VyY2UiLCJiZmZfYXBpX3Jlc291cmNlIl0sImV4cCI6MTcxNzc2Nzk1MywidXNlcl9uYW1lIjoiSkEwNDA4NDEiLCJqdGkiOiI2MTQ4MmRhZi0wNDMyLTRmOWYtOTIzMy00NDJjZGY3NjU1ZWMiLCJjbGllbnRfaWQiOiJjY2QwMGI3NzM0OTBkY2I3NDE1ZWU1MzUzMDk3NmVkNERaUkw1d2ZKOExxIiwic2NvcGUiOlsicmVhZCJdfQ.RYOFGkXm7vIKWM8YpNpmzs9SOz5TojSuHvCsLBpqKvk').then(result => {
    // console.log(result);
    if (result.status) {
        const data = result.data
        const dom = new JSDOM(data)
        const { window } = dom
        const $ = require('jquery')(window);
        const htmlContent = $('script').html()
        const reg = /var goUrl = "(.+)";/gm
        const execResult = reg.exec(htmlContent);
        const newUrl = 'https://oa-idaas.jasolar.com:19094' + execResult[1];
        axios.get(newUrl).then(result => {
            console.log(result);
        }, err => {
            console.log(err);
        })
    }
}, err => {
    console.log(err);
})