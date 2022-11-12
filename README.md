# Obsidian Image Layouts

I wanted a way to lay images out inside obsidian notes in a `beautiful` way. This is my first attempt at that. It's a bit rough around the edges, because it's still quite new, but I hope that it's useful in displaying image heavy notes. I wanted the ability to visually tell stories, and this is a good first step.

## Usage

In order to get the image layout use \`\`\` followed by the layout you want e.g. \`\`\`image-layout-a

Images can either be in wikilink format `![[imagename]]` in which case it will load from the local vault, or in `![](url)` format, which will load remotely.

The number of images varies depending on the layout. If you don't have enough it will display a placeholder. If you have too many they'll simply be hidden.

## Roadmap

When I find time I'm hoping to add the following:

- Overlay text on images
- Image captions
- General gallery to support scrolling through photos
- Drag and drop support
- Visually pick empty layouts

## Available Layouts

Below are the available layouts. If you can think of other layouts that might be included, feel free to suggest them (or raise a PR).

### image-layout-a

    ```image-layout-a
    ![](https://images.unsplash.com/photo-1543726969-a1da85a6d334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3636&q=80)
    ![](https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHN0b3J5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
    ```

![](docs/layout-a.png)

### image-layout-b

    ```image-layout-b
    ![](https://images.unsplash.com/photo-1452065656801-6c60b6e7cbc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)
    ![](https://images.unsplash.com/photo-1592634244339-809d45f1dd25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHNhaWxpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60)
    ```

![](docs/layout-b.png)

### image-layout-c

    ```image-layout-c
    ![](https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
    ![](https://images.unsplash.com/photo-1667778679906-ca90d133c0c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
    ```

![](docs/layout-c.png)

### image-layout-d

```image-layout-d
![](https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXN8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhcmlzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
![](https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3846&q=80)
```

![](docs/layout-d.png)

### image-layout-e

    ```image-layout-e
    ![](https://images.unsplash.com/photo-1667115309281-d6cd9ba57f62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80)
    ![](https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzJ8fHZpcnR1YWwlMjByZWFsaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
    ![](https://images.unsplash.com/photo-1592477725143-2e57dc728f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3206&q=80)
    ```

![](docs/layout-e.png)

### image-layout-f

    ```image-layout-f
    ![](https://images.unsplash.com/photo-1554378739-200b04da4e8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGltZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=900&q=60)
    ![](https://images.unsplash.com/photo-1619167801419-bfeca51bdfba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2360&q=80)
    ![](https://images.unsplash.com/photo-1603574670812-d24560880210?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2360&q=80)
    ![](https://images.unsplash.com/photo-1610298324710-5a73230400c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFsbSUyMHRyZWV8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60)
    ```

![](docs/layout-f.png)

### image-layout-g

    ```image-layout-g
    ![](https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
    ![](https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80)
    ![](https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3546&q=80)
    ![](https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3174&q=80)
    ```

![](docs/layout-g.png)

### image-layout-h

    ```image-layout-h
    ![](https://images.unsplash.com/photo-1608734265656-f035d3e7bcbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
    ![](https://images.unsplash.com/photo-1508002366005-75a695ee2d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1568&q=80)
    ![](https://images.unsplash.com/photo-1498757581981-8ddb3c0b9b07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1588&q=80)
    ```

![](docs/layout-h.png)

### image-layout-i

    ```image-layout-i
    ![](https://images.unsplash.com/photo-1493589976221-c2357c31ad77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80)
    ![](https://images.unsplash.com/photo-1557434440-d4d48e6578b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1635&q=80)
    ![](https://images.unsplash.com/photo-1541956064527-8ec10ac76c31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFsbHxlbnwwfDF8MHx8&auto=format&fit=crop&w=900&q=60)
    ![](https://images.unsplash.com/photo-1522043436628-a4bd7867030b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdpbnRlcnxlbnwwfDF8MHx8&auto=format&fit=crop&w=900&q=60)
    ```

![](docs/layout-i.png)
