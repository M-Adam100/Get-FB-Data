

(async () => {

  const arr = [];

  function coverArticles(posts) {

    [...posts].forEach(article => {
      let data = {}
      const photoLink = [...article.querySelectorAll('a')]?.filter(item => item.href.includes('photos'));
      const description = article.querySelector('div[dir="auto"]')?.innerText;
      data['description'] = description;
      if (photoLink.length) {
        const imgSrc = photoLink[0].querySelector('img').src;
        data['media'] = imgSrc;
      }
      arr.push(data);
      
    })
console.log(arr);
    
  }


  chrome.storage.local.get(['number'], (CS) => {
    let posts;
    const interval = setInterval(() => {
      posts = [...document.querySelectorAll(`div[role="article"][aria-labelledby]:not([articleCovered]), [data-pagelet="MainFeed"] > * > * > div:not([articleCovered]`)];
      posts.forEach(post => {
        [...post.querySelectorAll('div')]?.filter(item => item.innerText == 'See more')[0]?.click();
      })

      console.log(posts.length);
      if (posts.length < CS.number) {
        window.scrollBy(
          0,
          document.scrollingElement.scrollHeight - (window.scrollY + window.innerHeight)
        );
      } else {
        clearInterval(interval);
        posts = posts.slice(0, CS.number);
        coverArticles(posts);
      } 
    }, 5000)



  })
})()






// setInterval(coverArticles, 1000);