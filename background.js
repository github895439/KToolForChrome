function timerHandler()
{
    if (mutex)
    {
        return;
    }

    mutex = true;
    chrome.storage.local.get(null,
        (result) =>
        {
            console.debug(result);
            if (result.reloadInterval != undefined)
            {
                if (result.nextReload != -1)
                {
                    let now = Date.now();

                    if (result.nextReload <= now)
                    {
                        now += result.reloadInterval * 1000;
                        result.nextReload = now;
                        chrome.storage.local.set(result,
                            () =>
                            {
                                chrome.tabs.reload(result.tabId);
                            });
                    }
                }
            }
        });
    mutex = false;
}

var mutex = false;

setInterval(timerHandler, 10 * 1000);
