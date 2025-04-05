import { Builder, By, until, type WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox";
import * as fs from "fs";

export interface JobData {
  data_index: string;
  title: string;
  company: string;
  company_logo: string;
  salary: string;
  location: string;
  remote_status: string;
  skills: string[];
  url: string;
  scraped_at: string;
}

interface JustJoinApiJob {
  id: string;
  title: string;
  company_name: string;
  company_logo_url?: string;
  salary_from?: number;
  salary_to?: number;
  salary_currency?: string;
  city?: string;
  remote: boolean;
  skills?: string[];
}

export class JustJoinScraper {
  private url: string;
  private jobs: Map<string, JobData>;
  private driver: WebDriver;
  private maxJobs: number;
  private lastSeenIndex: number;

  constructor(url: string, headless: boolean = true) {
    this.url = url;
    this.jobs = new Map();
    this.maxJobs = 1000;
    this.lastSeenIndex = -1;

    const firefoxOptions = new Options();
    if (headless) {
      firefoxOptions.addArguments("--headless");
    }
    firefoxOptions.addArguments("--width=1920");
    firefoxOptions.addArguments("--height=1080");
    firefoxOptions.setPreference("dom.webnotifications.enabled", false);
    firefoxOptions.setPreference("app.update.enabled", false);

    this.driver = new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  async scrape(scrollPauseTime: number = 2000): Promise<JobData[]> {
    try {
      await this.driver.get(this.url);

      await this.driver.wait(
        until.elementLocated(By.css("[data-index]")),
        15000
      );

      let scrollCount = 0;
      let noNewJobsCount = 0;

      while (this.jobs.size < this.maxJobs && noNewJobsCount < 5) {
        const currentJobCount = this.jobs.size;
        await this.extractVisibleJobs();

        if (this.jobs.size > currentJobCount) {
          console.log(
            `Found ${this.jobs.size - currentJobCount} new jobs. Total: ${
              this.jobs.size
            }`
          );
          noNewJobsCount = 0;
        } else {
          noNewJobsCount++;
        }

        await this.driver.executeScript(
          "window.scrollBy(0, window.innerHeight);"
        );
        scrollCount++;
        console.log(`Scrolling... (#${scrollCount})`);
        await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));
      }

      console.log(
        `Scraping finished. Total jobs collected: ${this.jobs.size}`
      );
      return Array.from(this.jobs.values());
    } catch (error) {
      console.error(`An error occurred during scraping: ${error}`);
      return Array.from(this.jobs.values());
    } finally {
      await this.driver.quit();
      console.log("Browser closed");
    }
  }

  private async extractVisibleJobs(): Promise<void> {
    try {
      const jobElements = await this.driver.findElements(
        By.css("[data-index]")
      );
      let newJobs = 0;

      for (const jobElement of jobElements) {
        try {
          const dataIndex = await jobElement.getAttribute("data-index");
          if (!dataIndex || this.jobs.has(dataIndex)) continue;

          const indexNum = parseInt(dataIndex);
          this.lastSeenIndex = Math.max(this.lastSeenIndex, indexNum);
          const jobData = await this.parseJobElement(jobElement, dataIndex);

          if (jobData) {
            this.jobs.set(dataIndex, jobData);
            newJobs++;
          }
        } catch (error) {
          console.warn(`Failed to parse job element: ${error}`);
          continue;
        }
      }

      if (newJobs > 0) {
        console.log(`Extracted ${newJobs} new job listings`);
      }
    } catch (error) {
      console.error(`Error extracting jobs: ${error}`);
    }
  }

  private async parseJobElement(
    jobElement: any,
    dataIndex: string
  ): Promise<JobData | null> {
    try {
      const titleElement = await jobElement.findElement(By.css("h3"));
      const title = (await titleElement.getText()) ?? "N/A";

      let company = "N/A";
      try {
        const companyElement = await jobElement.findElement(
          By.css("div.MuiBox-root.css-1kb0cuq > span:nth-child(2)")
        );
        company = (await companyElement.getText()) ?? "N/A";
      } catch {
        // Company element not found
      }

      let salary = "N/A";
      try {
        const salaryContainer = await jobElement.findElement(
          By.css("div.MuiBox-root.css-18ypp16")
        );
        const salaryText = await salaryContainer.getText();
        if (salaryText.includes("Undisclosed Salary")) {
          salary = "Undisclosed Salary";
        } else {
          const spans = await salaryContainer.findElements(By.css("span"));
          if (spans.length >= 3) {
            const minSalary = await spans[0].getText();
            const maxSalary = await spans[1].getText();
            const currency = await spans[2].getText();
            salary = `${minSalary.trim()} - ${maxSalary.trim()} ${currency.trim()}`;
          } else {
            salary = salaryText.trim();
          }
        }
      } catch {
        // Salary element not found
      }

      let location = "N/A";
      try {
        const locationElement = await jobElement.findElement(
          By.css("span.css-1o4wo1x")
        );
        location = (await locationElement.getText()) ?? "N/A";
      } catch {
        // Location element not found
      }

      let remoteStatus = "Not specified";
      try {
        const remoteElement = await jobElement.findElement(
          By.xpath(
            './/span[contains(text(), "Fully remote")] | .//span[contains(text(), "remote")]'
          )
        );
        remoteStatus = (await remoteElement.getText()) ?? "Not specified";
      } catch {
        // Remote status element not found
      }

      const skills: string[] = [];
      try {
        const skillElements = await jobElement.findElements(
          By.css(
            "div.skill-tag-1 div, div.skill-tag-2 div, div.skill-tag-3 div"
          )
        );
        for (const skill of skillElements) {
          const skillText = await skill.getText();
          if (skillText && skillText.toLowerCase() !== "new") {
            skills.push(skillText.trim());
          }
        }
      } catch {
        // Skills elements not found
      }

      let jobUrl = "N/A";
      try {
        const linkElement = await jobElement.findElement(By.css("a"));
        jobUrl = (await linkElement.getAttribute("href")) ?? "N/A";
      } catch {
        // URL element not found
      }

      let companyLogo = "N/A";
      try {
        const companyLogoElement = await jobElement.findElement(
          By.css("img#offerCardCompanyLogo")
        );
        companyLogo = (await companyLogoElement.getAttribute("src")) ?? "N/A";
      } catch {
        // Company logo element not found
      }

      return {
        data_index: dataIndex,
        title,
        company,
        company_logo: companyLogo,
        salary,
        location,
        remote_status: remoteStatus,
        skills,
        url: jobUrl,
        scraped_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to parse job element ${dataIndex}: ${error}`);
      return null;
    }
  }

  async saveToJson(filename: string = "jobs.json"): Promise<void> {
    try {
      const jobList = Array.from(this.jobs.values());
      await fs.promises.writeFile(
        filename,
        JSON.stringify(jobList, null, 4),
        "utf-8"
      );
      console.log(`Successfully saved ${jobList.length} jobs to ${filename}`);
    } catch (error) {
      console.error(`Failed to save JSON file: ${error}`);
    }
  }

  async saveToCsv(filename: string = "jobs.csv"): Promise<void> {
    try {
      const jobList = Array.from(this.jobs.values());
      const csvHeader =
        "data_index,title,company,company_logo,salary,location,remote_status,skills,url,scraped_at\n";
      const csvRows = jobList
        .map((job) => {
          const skills = job.skills.join(";");
          return `${job.data_index},"${job.title}","${job.company}","${job.company_logo}","${job.salary}","${job.location}","${job.remote_status}","${skills}","${job.url}","${job.scraped_at}"`;
        })
        .join("\n");

      await fs.promises.writeFile(filename, csvHeader + csvRows, "utf-8");
      console.log(`Successfully saved ${jobList.length} jobs to ${filename}`);
    } catch (error) {
      console.error(`Failed to save CSV file: ${error}`);
    }
  }
}

export async function fetchJustJoinJobs(): Promise<JobData[]> {
  try {
    const response = await fetch('https://justjoin.it/api/offers');
    if (!response.ok) {
      throw new Error('Failed to fetch jobs from JustJoin.it');
    }

    const data = await response.json() as JustJoinApiJob[];
    return data.map((job) => ({
      data_index: job.id,
      title: job.title,
      company: job.company_name,
      company_logo: job.company_logo_url ?? 'N/A',
      salary: job.salary_from && job.salary_to
        ? `${job.salary_from} - ${job.salary_to} ${job.salary_currency ?? ''}`
        : 'N/A',
      location: job.city ?? 'N/A',
      remote_status: job.remote ? 'Remote' : 'On-site',
      skills: job.skills ?? [],
      url: `https://justjoin.it/offers/${job.id}`,
      scraped_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching jobs from JustJoin.it:', error);
    return [];
  }
}
