import pandas as pd
import numpy as np
import scipy.stats as stats
import re
nhl_df=pd.read_csv("assets/nhl.csv")
cities=pd.read_html("assets/wikipedia_data.html")[1]
cities=cities.iloc[:-1,[0,3,5,6,7,8]]

def nhl_correlation(): 
    # YOUR CODE HERE
    
    # Process city data to clean references
    hockey_cities = cities.copy()
    hockey_cities['NHL'] = hockey_cities['NHL'].str.replace(r'\[.*?\]', '')
    
    # Create mapping from team to metropolitan area
    metro_map = hockey_cities[['Metropolitan area', 'NHL']].set_index('NHL')
    metro_map = metro_map[~metro_map.index.isin(['—', ''])]
    
    # Filter NHL data for 2018 only
    hockey_data = nhl_df[nhl_df['year'] == 2018]
    hockey_data = hockey_data.drop([0, 9, 18, 26], axis=0)  # Remove non-team rows
    
    # Clean team names and map to metro areas
    hockey_data['team_clean'] = hockey_data['team'].apply(lambda x: x[:-1].strip() if x.endswith("*") else x.strip())
    
    # Extract metro areas from team names
    def map_to_metro(team_name):
        team_suffix = team_name.split(" ")[-1]
        for idx in metro_map.index:
            if team_suffix in idx:
                return metro_map.at[idx, 'Metropolitan area']
    
    hockey_data['metro_area'] = hockey_data['team_clean'].apply(map_to_metro)
    
    # Get population data
    metro_populations = hockey_cities[['Metropolitan area', 'Population (2016 est.)[8]']]
    metro_populations = metro_populations.set_index('Metropolitan area')
    
    # Calculate win/loss ratios by metropolitan area
    metro_results = []
    for area, area_data in hockey_data.groupby('metro_area'):
        wins = np.sum(pd.to_numeric(area_data['W']))
        losses = np.sum(pd.to_numeric(area_data['L']))
        games = wins + losses
        win_ratio = wins / games
        metro_results.append({
            'Metro': area,
            'WinRatio': win_ratio
        })
    
    # Create final dataframe with results
    hockey_results = pd.DataFrame(metro_results)
    hockey_results = hockey_results.set_index('Metro')
    
    # Merge with population data
    final_hockey_data = pd.merge(hockey_results, metro_populations, how="inner", left_index=True, right_index=True)
    final_hockey_data['Population'] = pd.to_numeric(final_hockey_data['Population (2016 est.)[8]'])
    
    # Prepare output lists
    population_by_region = final_hockey_data['Population'].tolist()
    win_loss_by_region = final_hockey_data['WinRatio'].tolist()
    
    assert len(population_by_region) == len(win_loss_by_region), "Q1: Your lists must be the same length"
    assert len(population_by_region) == 28, "Q1: There should be 28 teams being analysed for NHL"
    
    return stats.pearsonr(population_by_region, win_loss_by_region)[0]

    #q 3

    import pandas as pd
import numpy as np
import scipy.stats as stats
import re
mlb_df=pd.read_csv("assets/mlb.csv")
cities=pd.read_html("assets/wikipedia_data.html")[1]
cities=cities.iloc[:-1,[0,3,5,6,7,8]]

def mlb_correlation(): 
    # YOUR CODE HERE
    
    # Create functions to clean data and map teams to metro areas
    def remove_citations(text):
        if re.search(r'\[[a-z]* [0-9]+\]', text) is None:
            return text
        else:
            return text.replace(re.search(r'\[[a-z]* [0-9]+\]', text).group(), '')
    
    def find_metro_area(team_name):
        for city_entry in list(baseball_metro_map.index.values):
            if team_name in city_entry:
                return baseball_metro_map.at[city_entry, 'Metropolitan area']
    
    # Clean the cities data
    baseball_cities = cities.copy()
    baseball_cities['MLB'] = baseball_cities['MLB'].apply(remove_citations)
    
    # Create metro area mapping
    baseball_metro_map = baseball_cities[['Metropolitan area', 'MLB']].set_index('MLB')
    baseball_metro_map = baseball_metro_map.drop(['—', ''], axis=0)
    
    # Filter baseball data for 2018
    baseball_stats = mlb_df[mlb_df['year'] == 2018]
    
    # Get population data
    metro_populations = baseball_cities[['Metropolitan area', 'Population (2016 est.)[8]']]
    metro_populations = metro_populations.set_index('Metropolitan area')
    
    # Map teams to metropolitan areas
    baseball_stats['metro_area'] = baseball_stats['team'].apply(lambda x: x.split(" ")[-1])
    baseball_stats['metro_area'] = baseball_stats['metro_area'].apply(find_metro_area)
    
    # Special case fix for Boston
    baseball_stats.at[0, 'metro_area'] = 'Boston'
    
    # Calculate win-loss ratios by metro area
    metro_results = []
    for area, area_data in baseball_stats.groupby('metro_area'):
        wins = np.sum(pd.to_numeric(area_data['W']))
        losses = np.sum(pd.to_numeric(area_data['L']))
        games = wins + losses
        win_ratio = wins / games
        metro_results.append({
            'Metro': area,
            'WinRatio': win_ratio
        })
    
    # Create and process the final dataframe
    baseball_results = pd.DataFrame(metro_results)
    baseball_results = baseball_results.set_index('Metro')
    final_baseball_data = pd.merge(baseball_results, metro_populations, how="inner", left_index=True, right_index=True)
    final_baseball_data['Population'] = pd.to_numeric(final_baseball_data['Population (2016 est.)[8]'])
    
    # Extract final lists for correlation
    population_by_region = final_baseball_data['Population'].tolist()
    win_loss_by_region = final_baseball_data['WinRatio'].tolist()
    
    assert len(population_by_region) == len(win_loss_by_region), "Q3: Your lists must be the same length"
    assert len(population_by_region) == 26, "Q3: There should be 26 teams being analysed for MLB"
    
    return stats.pearsonr(population_by_region, win_loss_by_region)[0]


# q 4
import pandas as pd
import numpy as np
import scipy.stats as stats
import re
nfl_df=pd.read_csv("assets/nfl.csv")
cities=pd.read_html("assets/wikipedia_data.html")[1]
cities=cities.iloc[:-1,[0,3,5,6,7,8]]

def nfl_correlation(): 
    # YOUR CODE HERE
    
    # Define functions to clean data
    def remove_citations(text):
        if re.search(r'\[[a-z]* [0-9]+\]', text) is None:
            return text
        else:
            return text.replace(re.search(r'\[[a-z]* [0-9]+\]', text).group(), '')
    
    def remove_asterisks(text):
        if re.search(r'\*|\+', text) is None:
            return text
        else:
            return text.replace(re.search(r'\*|\+', text).group(), '')
    
    def find_metro_area(team_name):
        for city_entry in list(football_metro_map.index.values):
            if team_name in city_entry:
                return football_metro_map.at[city_entry, 'Metropolitan area']
    
    # Process cities data
    football_cities = cities.copy()
    football_cities['NFL'] = football_cities['NFL'].apply(remove_citations)
    
    # Create metro area mapping
    football_metro_map = football_cities[['Metropolitan area', 'NFL']].set_index('NFL')
    football_metro_map = football_metro_map.drop(['—', ''], axis=0)
    
    # Get population data
    metro_populations = football_cities[['Metropolitan area', 'Population (2016 est.)[8]']]
    metro_populations = metro_populations.set_index('Metropolitan area')
    
    # Clean NFL data and filter for 2018
    football_stats = nfl_df[nfl_df['year'] == 2018].drop([0, 5, 10, 15, 20, 25, 30, 35])
    football_stats['team'] = football_stats['team'].apply(remove_asterisks)
    
    # Map teams to metro areas
    football_stats['metro_area'] = football_stats['team'].apply(lambda x: x.split(" ")[-1])
    football_stats['metro_area'] = football_stats['metro_area'].apply(find_metro_area)
    
    # Calculate win-loss ratios by metro area
    metro_results = []
    for area, area_data in football_stats.groupby('metro_area'):
        wins = np.sum(pd.to_numeric(area_data['W']))
        losses = np.sum(pd.to_numeric(area_data['L']))
        games = wins + losses
        win_ratio = wins / games
        metro_results.append({
            'Metro': area,
            'WinRatio': win_ratio
        })
    
    # Create and process final dataframe
    football_results = pd.DataFrame(metro_results)
    football_results = football_results.set_index('Metro')
    final_football_data = pd.merge(football_results, metro_populations, how="inner", left_index=True, right_index=True)
    final_football_data['Population'] = pd.to_numeric(final_football_data['Population (2016 est.)[8]'])
    
    # Extract final lists for correlation
    population_by_region = final_football_data['Population'].tolist()
    win_loss_by_region = final_football_data['WinRatio'].tolist()
    
    assert len(population_by_region) == len(win_loss_by_region), "Q4: Your lists must be the same length"
    assert len(population_by_region) == 29, "Q4: There should be 29 teams being analysed for NFL"
    
    return stats.pearsonr(population_by_region, win_loss_by_region)[0]