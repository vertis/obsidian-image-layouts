---
updated: '2022-07-23T04:52:38.366Z'
created: '2022-07-23T04:51:52.429Z'
---

While I love Obsidian there are a few things that it's lacking. One is a way of visually telling stories. Not just lumping images in to have displayed one by one. So I created a plugin to lay the images out in a beautiful way.

Allowing you to tell stories in your notes. From the simple 2 up `image-layout-a`

```image-layout-a
![](https://images.unsplash.com/photo-1543726969-a1da85a6d334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3636&q=80)
![](https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHN0b3J5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
```

Into ever more complex layouts :

```image-layout-b
---
caption: Image Layout B
descriptions:
  - Under Sail
  - Our spot for the night
---
![](https://images.unsplash.com/photo-1452065656801-6c60b6e7cbc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)
![](https://images.unsplash.com/photo-1592634244339-809d45f1dd25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHNhaWxpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60)
```

```image-layout-b
---
caption: Image Layout B with Alts
permanentOverlay: true
---
![Sailing](https://images.unsplash.com/photo-1452065656801-6c60b6e7cbc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)
![Anchoring](https://images.unsplash.com/photo-1592634244339-809d45f1dd25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHNhaWxpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60)
```

`image-layout-c`

```image-layout-c
![](https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
![](https://images.unsplash.com/photo-1667778679906-ca90d133c0c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
```

`image-layout-d`

```image-layout-d
![](https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXN8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhcmlzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3846&q=80)
```

`image-layout-e`

```image-layout-e
![](https://images.unsplash.com/photo-1667115309281-d6cd9ba57f62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80)
![](https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzJ8fHZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1592477725143-2e57dc728f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3206&q=80)
```

`image-layout-f`

```image-layout-f
![](https://images.unsplash.com/photo-1554378739-200b04da4e8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGltZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1619167801419-bfeca51bdfba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2360&q=80)
![](https://images.unsplash.com/photo-1603574670812-d24560880210?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2360&q=80)
![](https://images.unsplash.com/photo-1610298324710-5a73230400c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFsbSUyMHRyZWV8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
```


`image-layout-g`

```image-layout-g
![](https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
![](https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
![](https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3546&q=80)
![](https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)
```

`image-layout-h`

```image-layout-h
![](https://images.unsplash.com/photo-1608734265656-f035d3e7bcbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
![](https://images.unsplash.com/photo-1508002366005-75a695ee2d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1568&q=80)
![](https://images.unsplash.com/photo-1498757581981-8ddb3c0b9b07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1588&q=80)
```


`image-layout-i`

```image-layout-i
![](https://images.unsplash.com/photo-1493589976221-c2357c31ad77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
![](https://images.unsplash.com/photo-1557434440-d4d48e6578b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1635&q=80)
![](https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFsbHxlbnwwfDF8MHx8&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1522043436628-a4bd7867030b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdpbnRlcnxlbnwwfDF8MHx8&auto=format&fit=crop&w=900&q=60)
```

`image-layout-single`

```image-layout-single
---
caption: Images#^fig-TCRv1_rie 
permanentOverlay: false # the default is false
---

![](https://images.unsplash.com/photo-1543726969-a1da85a6d334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3636&q=80)
```
