# String Select Unlimited

A wrapper around discord.js `StringSelectMenu` to bypass Discord's 25 option limit by adding pagination.

-  Used by [Pokecord++](https://pokecord.org) and [Audicy](https://audicy.xyz) Discord bots.

# Install

`npm install stringselectunlimited`

# Usage

## Constructor

`StringSelectUnlimited(options : StringSelectMenuOptions)`

|   Parameter    |   Type   |                     Description                     | Required |         Default         |
|:--------------:|:--------:|:---------------------------------------------------:|:--------:|:-----------------------:|
| `pageMetadata` | PageData | Additional data to stringify along with page option |    no    | { emoji: {}, data: {} } |
|  `totalItems`  |  number  |                Total number of items                |    no    |            0            |
|     `page`     |  number  |                 Initial page number                 |    no    |            1            |

## Methods

| Method |  Parameters  |        Description        |
|:------:|:------------:|:-------------------------:|
| `goto` | page: number | Navigate to specific page |

## Setters

|      Method       |     Parameters     |     Description      |
|:-----------------:|:------------------:|:--------------------:|
| `setPageMetadata` | metadata: PageData | Update page metadata |
|  `setTotalItems`  |   total: number    |  Update total items  |

## Getters

|       Method        | Returns  |           Description            |
|:-------------------:|:--------:|:--------------------------------:|
|   `pageMetadata`    | PageData |          Page Metadata           |
| `currentPageNumber` |  number  |       Current page number        |
|  `totalPageNumber`  |  number  |      Total number of pages       |
|  `nextPageNumber`   |  number  |         Next page number         |
|  `prevPageNumber`   |  number  |       Previous page number       |
|     `pageSize`      |  number  | Menu size excluding page options |


# Examples

## Dynamic Pagination

```js
import axios from 'axios';
import {ActionRowBuilder} from 'discord.js';
import {StringSelectUnlimited} from 'StringSelectUnlimited';

const menu = new StringSelectUnlimited().setTotalItems(500);
const limit = menu.pageSize;
const offset = limit * (menu.currentPageNumber - 1);

const {data} = await axios.get(`https://example.com/api/data`, {params: {limit, offset}});
menu.setOptions(
	data.map(d => ({label: d.title, value: String(d.id)})
    ));

return new ActionRowBuilder().addComponents(menu);
```

## Preloaded Pagination

```js
import {ActionRowBuilder} from 'discord.js';
import {StringSelectUnlimited} from 'StringSelectUnlimited';

const data = [{label: 'Example', value: '1'}]; // large array
const menu = new StringSelectUnlimited().setOptions(data);
return new ActionRowBuilder().addComponents(menu);
```

