// ==UserScript==
// @name          Sim Racer Hub Race Result Table Copy
// @version       0.1.0
// @description   Copies the result table for easy paste into Excel
// @author        Gavin Adams
// @match         https://www.simracerhub.com/scoring/season_race.php?*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=simracerhub.com
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @updateurl     https://raw.githubusercontent.com/gadams999/user-scripts/main/obrl/oblr-src-result-table-copy.js
// @downloadurl   https://raw.githubusercontent.com/gadams999/user-scripts/main/obrl/oblr-src-result-table-copy.js
// ==/UserScript==

(function () {
  "use strict";

  function copyTable() {
    const tables = document.querySelectorAll(".react-table");
    let table = null;
    let table_text = null;
    const re = /^(?<header>FIN.*TEAM..)(?<body>.*)$/s;
    let header = "";
    let body = "";
    switch (tables.length) {
      case 0:
        alert(`There are no HTML tables.`);
        break;
      case 1:
        table = tables[0];
      case 3:
        // 2024-02-16 - SRH shows 3 tables today. This may change.
        table = tables[0];
      default:
        if (table === null) {
          const choice = parseInt(
            prompt(
              `There are ${tables.length} tables and should only have 3, so something has changed. What table (1 should be the default) would you like to load?`
            )
          );
          if (choice >= 1 && choice <= tables.length) {
            table = tables[choice - 1];
          } else {
            alert(`Number is out of range, please try again.`);
            copyTable();
            return;
          }
        }
        var x = table.outerText;
        //console.log(x)
        table_text = x.match(re);
        header = table_text.groups.header;
        body = table_text.groups.body;
        // header -- replace \n with ' '
        header = header.replaceAll(/(\w)\n(\w)/g, "$1 $2");
        // header -- replace \n\t\n with \t
        header = header.replaceAll(/\n\t\n/g, "\t");
        // header -- strip final \n
        header = header.substring(0, header.length - 1);
        console.log(JSON.stringify(header));
        // body -- strip final \t
        body = body.substring(0, body.length - 1);

        GM_setClipboard("".concat(header, body), "text");
        alert(
          `Table is propably copied (well, without Fisch's details, lol). Now paste it into spreadsheet.`
        );
    }
  }

  GM_registerMenuCommand("Copy table for spreadsheet", copyTable);
})();
