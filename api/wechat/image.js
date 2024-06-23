const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const getJquery = (html) => {
    const dom = new JSDOM(html)
    const { window } = dom
    return require('jquery')(window);
}
// 抓一部分图片数据
axios.get('https://vavebg.com/').then(result => {
    const $ = getJquery(result.data)
    const imageSet = new Set()
    $('.framer-5gn2os img').each((index, img) => {
        imageSet.add(img.src)
    });
})

[
    'https://framerusercontent.com/images/QOyLFXvdhaHuLDFjPwqOMamkoE.png',
    'https://framerusercontent.com/images/Kkh7WNqry6ws3r1dKDnKT7PkXxw.png',
    'https://framerusercontent.com/images/8cysXoKWZVXh8WH4cjAskihfKjE.png',
    'https://framerusercontent.com/images/hVuZgJmpV2GERNPfg9NynAk06s.png',
    'https://framerusercontent.com/images/xJWrZ1hPjXLcgS1lGdtbjL0u4.png',
    'https://framerusercontent.com/images/Khbbv5VE06GL6HQTj1Kie9YC8.png',
    'https://framerusercontent.com/images/v80oHNdvCZ6KSAYRxf0vZA54.png',
    'https://framerusercontent.com/images/C88cbwSpJDcA8vXupNWpsfih3Y.png',
    'https://framerusercontent.com/images/kWRrVPPTUqv1Xtp65J6YYHTojw.png',
    'https://framerusercontent.com/images/u3mMF9yXOjU4qvIevwqIvoSSCE.png',
    'https://framerusercontent.com/images/j0D5U6eMk7CcF5MwFcGTJVHivc.png',
    'https://framerusercontent.com/images/rkN8W22XPpAWNaupuiChoIa2arI.png',
    'https://framerusercontent.com/images/4RtzyYCMgVDDfnXEyQErsAB12Mo.png',
    'https://framerusercontent.com/images/vC02gELItyHOJA241S7MYvmBE.png',
    'https://framerusercontent.com/images/qVZJzMqb1Z0WvPdg0npHzm7FaE.png',
    'https://framerusercontent.com/images/5hFpwWnVMn3uYNONZt8XxrUXACk.png',
    'https://framerusercontent.com/images/5wdRq16iE0MNzR2WUILNHg7lO4I.png',
    'https://framerusercontent.com/images/kLnLk37EVmVcFYSfau7OLc75UZM.png',
    'https://framerusercontent.com/images/yNr0hXGcpHPRQfzcdOZSDL4KHM.png',
    'https://framerusercontent.com/images/bQnMMv30MPPjwKb7TyvrJ4xL1hg.png',
    'https://framerusercontent.com/images/w4D4FN4CmN3ZklBj7Jt57kUAgQ.png',
    'https://framerusercontent.com/images/6LJlVF1GrKSr6ZoaheZfTKwSMc.png',
    'https://framerusercontent.com/images/6PidkEKafukrUpWJDF4caUMyyHk.png',
    'https://framerusercontent.com/images/VXF4WdWARwmfaAS4HEarTly3USU.png',
    'https://framerusercontent.com/images/rM5Ib7y6b96DAXywd449B9w.png',
    'https://framerusercontent.com/images/MkUUBNdBnA2Zkv2NNFfbc0Nvqo.png',
    'https://framerusercontent.com/images/Nsz4tejRmv4xCCEvMcMk3tVFK9Y.png',
    'https://framerusercontent.com/images/Ib80y8Kfsm9bEoDBc83XVY11Hc.png',
    'https://framerusercontent.com/images/ZTPxwkZC3avTMjU0N17opTd4.png',
    'https://framerusercontent.com/images/MdaBIZHhgV9z12W6vKtHy6YDx4.png',
    'https://framerusercontent.com/images/W7u5bzwWz8lqoR5GrwesIkBWtHE.png',
    'https://framerusercontent.com/images/lk3Xv0M3jDJcdl3rTSMkBoQouZA.png',
    'https://framerusercontent.com/images/vF5YabMgKOM6j8KrevK7fWZWyIY.png',
    'https://framerusercontent.com/images/9g4jUewdlNPMOD7o5hhy8Pj4No.png',
    'https://framerusercontent.com/images/fahbVlCpHdUQiWSdrTANXEZitg.png',
    'https://framerusercontent.com/images/6z3Kdx0NOMagkiAP7xv86eAXw.png',
    'https://framerusercontent.com/images/wW8uvLQOOIgH0t3o3EvBKUnuM.png',
    'https://framerusercontent.com/images/uayLc1nzaQoE3BH7VbUO0jXca0.png',
    'https://framerusercontent.com/images/ml1TiC4XPPT2Y2TdkDF5s94IXo.png',
    'https://framerusercontent.com/images/L0H1aNf686Rc5EXN9Zqs5EYM3ew.png',
    'https://framerusercontent.com/images/NOJVP19MfrQPHGraayeYsJaSjEE.png',
    'https://framerusercontent.com/images/Y1dyUhnENXsBZ8T3Ze36mNxD4EI.png',
    'https://framerusercontent.com/images/berisKFxvbj3SSapPLaDhvvpCJQ.png',
    'https://framerusercontent.com/images/38t9xsua6cUjPi2g7DXnxlDKgI.png',
    'https://framerusercontent.com/images/ZrZDM9LIDFvSQXbPpbTwzaUsXdc.png',
    'https://framerusercontent.com/images/T7qwhKojBsahnQTVVnjQJ8FBk.png',
    'https://framerusercontent.com/images/YRuJN3pbYHlAufVPVRBYUG4eAA.png',
    'https://framerusercontent.com/images/P7cJ2iGI2Pp7X6ihr4V6Zg9blA.png',
    'https://framerusercontent.com/images/2lmd2sI98tSzU6pvOCxq2iz8FA.png',
    'https://framerusercontent.com/images/fNvIqCzaQs5dEajw9RuFjBYlLE.png',
    'https://framerusercontent.com/images/iG36gP8foaI5c4ZsspqlVEXbS0.png',
    'https://framerusercontent.com/images/rDDVTrYZCiDvSWZHzusZ36UAME.png',
    'https://framerusercontent.com/images/ZYtfi0nKyRdfm44j0ZjUHeXR7pg.png',
    'https://framerusercontent.com/images/TazFK9jG3gkTt9OWy08CBtrRDVw.png',
    'https://framerusercontent.com/images/3fZCjNm5pSZE5sJic1IAeUBJWc4.png',
    'https://framerusercontent.com/images/HmxRKK41nSgdPDZeFHFTBHhSiM.png',
    'https://framerusercontent.com/images/x0JNKFoNnhFA3qVsjRtRRcoYg.png',
    'https://framerusercontent.com/images/RG0l0FEVGtzqVFQpOabIypZRTfs.png',
    'https://framerusercontent.com/images/kCnXbdCPc0flL9CJW0t8GLD9I.png',
    'https://framerusercontent.com/images/DxiTNd13gF53S7jeZkCdVzUrD3g.png',
    'https://framerusercontent.com/images/f4WyR1XHHzgiHXoU8I8xLxR0aRE.png',
    'https://framerusercontent.com/images/ZAiuJrHgsSeOfYcUM3XICPD1UjA.png',
    'https://framerusercontent.com/images/G68zlZvhcz6prxMr2n89VXiKfg.png',
    'https://framerusercontent.com/images/HQNmryPOiLried3h3xlTaV9ic.png',
    'https://framerusercontent.com/images/zx6bvKA9hif8gpAgMnxRwZNu0.png',
    'https://framerusercontent.com/images/V3CHJEhvkEv7uHcCWtEARmIdnpc.png',
    'https://framerusercontent.com/images/JST75P59DcjUhXUdOtVTkySlw.png',
    'https://framerusercontent.com/images/h6hITFKWFMZJt74pKvzDj6zfitQ.png',
    'https://framerusercontent.com/images/n027oSnrCbk4LG22DLmJaEIE9w.png',
    'https://framerusercontent.com/images/vcFE48SXT55d8ISm43WIOlJcaU.png',
    'https://framerusercontent.com/images/qDVJSX6xfYlWw3UANlVnOHSc.png',
    'https://framerusercontent.com/images/5kUkQDY1tHjNIFy05EnmNfdi3nA.png',
    'https://framerusercontent.com/images/yZseYVZl4ODirMe1XY4SETONESo.png',
    'https://framerusercontent.com/images/19jwta1WGkKbHRL3tWQ6AcQAaA.png',
    'https://framerusercontent.com/images/Ia6BnMZmZziuqckScWZh1EL2v0.png',
    'https://framerusercontent.com/images/7FjFFdRlpSlx8acO8qChvviFIOI.png',
    'https://framerusercontent.com/images/0amnefzFS5jr4t7yJQEVJuuRw.png',
    'https://framerusercontent.com/images/mDvbXAU76ncixInps8VF3Meu3I.png',
    'https://framerusercontent.com/images/HGnWEijJ1sgYGWWDrdUG0cBoA4.png',
    'https://framerusercontent.com/images/4XzM0gCxY4GyN3yyEJvOKfKs.png',
    'https://framerusercontent.com/images/iE0NqwJao72wEJgiOYuqIei5CGc.png',
    'https://framerusercontent.com/images/Eu3ntdoFRtmoe7S369T00RpnSI.png',
    'https://framerusercontent.com/images/t7HijfX89tR8ym3We5LW0CvROg.png',
    'https://framerusercontent.com/images/eJi9t1I4vXIsOcb2BXiP6k3B8Kk.png',
    'https://framerusercontent.com/images/q3STqG9eUfvNkCN1N04R2iqdfYU.png',
    'https://framerusercontent.com/images/McysyiiNqaEUgU2OPZE1WoNIAzw.png',
    'https://framerusercontent.com/images/ohwt6xOGICIecCpNnE8egHjyOR8.png',
    'https://framerusercontent.com/images/rt2tYhptzbxk5SelIApqWVoR9cY.png',
    'https://framerusercontent.com/images/Xn6VvHDuiHyNy3F4vT8rvJPabhM.png',
    'https://framerusercontent.com/images/8BGTBySPXeYzir2l5NC6HNtk9o.png',
    'https://framerusercontent.com/images/VRcH0byYBN77P3TtALXJpKJzWQM.png',
    'https://framerusercontent.com/images/LNMagXMTSuUR9MLdLXzHFLR0sfU.png',
    'https://framerusercontent.com/images/CfR27sG7WnC8RoGgRWldPWR0Fdc.png',
    'https://framerusercontent.com/images/GGqa9GYuRqqpggxA4lifkDXrZ38.png',
    'https://framerusercontent.com/images/lSHJaXU4fWjbihaJRQCAq9K8kaY.png',
    'https://framerusercontent.com/images/Y8D8lyh3zZ58yysfK2zutjUTL8.png',
    'https://framerusercontent.com/images/yYZMmHLtz82G9E7Xu1xzdDZLTHM.png',
    'https://framerusercontent.com/images/mgA0VkFVbhJqSsVR7P6XDjYkhs.png',
    'https://framerusercontent.com/images/tnzlPg1Q7BEO2C2uWqbYfAhTx7s.png',
    'https://framerusercontent.com/images/Zns4emAvK0Q4JOucIdhJPsNcnbM.png',
    'https://framerusercontent.com/images/6VssvCk0eiqpvc8n4enFV2Y07A8.png',
    'https://framerusercontent.com/images/5aJ6eCRff0C9jyTXzq80VzWIwfA.png',
    'https://framerusercontent.com/images/bbLTdzJtRNjYWetR6wklpleYk.png?lossless=1',
    'https://framerusercontent.com/images/qd46rg21zKBqQgMrOySTRqhitM.png',
    'https://framerusercontent.com/images/EHQMyQUnwNUk3imFNtZ15I5F8K8.png?lossless=1',
    'https://framerusercontent.com/images/C4ymNK4N5s00lI6MivbNTliQM.png',
    'https://framerusercontent.com/images/vvkxqhSkfeh6G4xPHPYOghpnaHo.png',
    'https://framerusercontent.com/images/ij5DcuU7kqAGIWzEMJ6tz3PTSnI.png',
    'https://framerusercontent.com/images/dUuybbMYsCanYuvZvkgzc8Fw8yk.png?lossless=1',
    'https://framerusercontent.com/images/SbjwEZWHSUdW436jybWlnvhvK2Q.png?lossless=1'
]