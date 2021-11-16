import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { container } from "@sapphire/framework";
import parseDomain from "extract-domain";
import { AntiPhish } from "../../config";

const BASE_URLs = [
    "https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-domains-ACTIVE.txt",
    "https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-domains-NEW-today.txt",
    "https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-links-ACTIVE.txt",
    "https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-links-ACTIVE-TODAY.txt"
]

export const phishingDomains = new Set<string>();
export const loadPhishDomains = () => {
    if (!AntiPhish.enabled) return container.logger.debug(`AntiPhish is disabled.`);
    BASE_URLs.forEach((url) => {
        fetch(url, FetchResultTypes.Text)
            .then((data) => {
                data.split("\n").forEach((domain) => {
                    if (domain.length > 0) {
                        const parsedDomain = parseDomain(domain);
                        if (parsedDomain !== "") phishingDomains.add(parsedDomain);
                    }
                });
            });
    });
    container.logger.debug("Loaded phishing domains to cache");
}