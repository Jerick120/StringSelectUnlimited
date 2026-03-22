# String Select Unlimited

A wrapper around discord.js `StringSelectMenu` to bypass Discord's 25 option limit by adding pagination.

-  Used by [Pokecord++](https://pokecord.org) and [Audicy](https://audicy.xyz) Discord bots.

# Install

`npm install string-select-unlimited`

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


