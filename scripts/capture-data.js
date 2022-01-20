

(async () => {

  const exportPosts = (arr) => {
    const items = arr;
    const replacer = (key, value) => value === null ? '' : value 
    const header = Object.keys(items[0])
    const csv = [
      header.join(','), 
      ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    let link = document.querySelector(['[id="exportLink"]']) || document.createElement("a");
    link.id = 'exportLink';
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURI(csv));
    link.setAttribute("download", `${document.title}.csv`);
    link.addEventListener('click', () => {
      console.log("Downloaded!");
    })
    link.click();
  }
  const arr = [];

  function coverArticles(posts) {

    for (let i = 0; i < [...posts].length; i++) {
      let article = [...posts][i];
      let data = {}
      const photoLink = [...article.querySelectorAll('a')]?.filter(item => item.href.includes('photos'));
      const description = article.querySelector('div[dir="auto"]')?.innerText;
      const date = article.querySelectorAll('a')[3]?.ariaLabel;
      data['Date'] = date;
      const formattedDescription = description.replace(/(<([^>]+)>)/ig, '').replace(/(\r\n|\n|\r)/gm, "").replace('#', '');
      data['Description'] = formattedDescription;
        const imgSrc = photoLink[0]?.querySelector('img')?.src;
        data['Media'] = imgSrc || [...article.querySelectorAll('a')]?.filter(item => item.href.includes('videos'))[0]?.href
        || "NO MEDIA";
    
      arr.push(data);
    }
    if (arr.length) {
      exportPosts(arr);
    }

  }


  chrome.storage.local.get(['number'], (CS) => {
    let posts;
    const interval = setInterval(() => {
      posts = [...document.querySelectorAll(`div[role="article"][aria-labelledby]:not([articleCovered]), [data-pagelet="MainFeed"] > * > * > div:not([articleCovered]`)];
      posts.forEach(post => {
        [...post.querySelectorAll('div')]?.filter(item => item.innerText == 'Voir plus')[0]?.click();
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