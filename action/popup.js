function initialize()
{
    eleCheckbox1 = document.getElementById("checkbox1");
    eleText = document.getElementById("text1");
    eleButton = document.getElementById("button1");
    eleButton.addEventListener("blur",
        () => {
            eleText.value = "";
        }
    );
    chrome.storage.local.get(null,
        (result) =>
        {
            if (result.reloadInterval == undefined)
            {
                chrome.storage.local.set(setting,
                    () =>
                    {
                        eleCheckbox1.checked = false;
                        eleButton.addEventListener("click", clickHandler);
                    });
            }
            else
            {
                setting = result;

                if (setting.nextReload == -1)
                {
                    eleCheckbox1.checked = false;
                }
                else
                {
                    eleCheckbox1.checked = true;
                }

                eleButton.addEventListener("click", clickHandler);
            }
        });
}

function clickHandler()
{
    if (eleCheckbox1.checked)
    {
        chrome.tabs.query({ active: true, currentWindow: true },
            (tabs) =>
            {
                let nextReload = Date.now();
                nextReload += RELOAD_INTERVAL * 1000;
                setting.nextReload = nextReload;
                setting.tabId = tabs[0].id;
                chrome.storage.local.set(setting,
                    () =>
                    {
                        eleText.value = "setting complete";
                    });
            }
        )
    }
    else
    {
        setting.nextReload = -1;
        chrome.storage.local.set(setting,
            () =>
            {
                eleText.value = "setting complete";
            });
    }
}

const RELOAD_INTERVAL = 60;
var eleCheckbox1;
var eleText;
var eleButton;
var setting =
{
    "reloadInterval": RELOAD_INTERVAL,
    "nextReload": -1,
    "tabId": -1
};

initialize();
