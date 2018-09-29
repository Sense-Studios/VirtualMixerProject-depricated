function FileManager( _source ) {

  var _self = this
  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!


  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  _self.getFileById = function( _id ) {
    var match = null
  }

  _self.getSrcByTags = function( _tags ) {
    // _tags = array
    if ( programs.length == 0 ) return "no programs"

    var matches = []
    programs.forEach( function( p, i) {
      //console.log(i, p)
      _tags.forEach( function( t, j) {
        //console.log( j, t)
        if ( p.tags.includes(t) ) {
          matches.push(p)
        }
      })
    })

    if ( matches.length == 0 ) return "no matches"
    var program = matches[ Math.floor( Math.random() * matches.length )]
    console.log(">> ", matches.length, program.title)
    _self.setSrc( _self.getSrcByQuality( program ) );
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  // load another source from the stack
  _self.change = function( _tag ) {

    if ( programs.length == 0 ) return "no programs"
    if ( _tag ) {
      _self.getSrcByTags( [ _tag ] );
      return;
    }

    console.log("change video")
    var program = programs[ Math.floor( Math.random() * programs.length ) ]
    if ( program.assets._type != "Video" ) {
      // noit elegible, try again
      _self.change()
      return
    }


    // for sensible data
    // through bucket
    var occupy_chaos = [
      "http://cdn.marduq.tv/veejay/occupy_chaos/grockit_answers/Grockit_Answers_The_Crisis_of_Credit_Visualized_-_HD.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/acrisisbegins.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/AIG_graph_andStuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/alan_greenspan_fraud.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/all_the_riches_and_moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/banks_and_graphs.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/banks_title.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/bernanky_crisis.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/brokers.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/bush_and_stuff_coming_down.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/bush_start.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/china2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/chinese_factories.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/chinese_factories2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/cocain_headlines.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/crisis_yes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/default_swap.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/default_swap_2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/documents.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/documents_and_banks.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/documents_and_graphs.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/documents_loans_and_flashes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/easy_money.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/eigties_fraud.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/final_filler.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/flashes_documents_stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/france_lux.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/fraudstreet_on_wallstreet.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/freddy_and_fannie.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_aaa_ratings.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_boom.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_boom_cheering.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_hours_worked_per_year.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_houshold_per_erson.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_lehmans_stock.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_one_percent.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_rating_agencies.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/graph_savings_from_bush_tax_cuts.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/guilty.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/guilty_and_documents.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/guilty_documents_and_moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/guilty_moar_guilty_ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/headlines.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/home_owners.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/how_it_all_works.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/how_it_all_works2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/Iceland.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/iceland_banks.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/iceland_houses.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/iceland_protest.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/iceland_rich_guy.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/iceland2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/Idontknow.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/incside_job_title.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/inner_city_life.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/kpmg.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/leverage_moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/leverage_ratio.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/living_in_temps.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/london_1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/luxeryusa.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/merrill lync.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/millions_game.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/moar_banks_bear_stersns.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/moar_documents_risk_ans_stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/moar_loans.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/mortgages.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/newyorknewyork1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/ninetees_fraud.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/numbers_game.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/obama_in_white_house.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/offices_tickers_and_stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/officesandstuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/paulson.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/poor_ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/real_estate_boom.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/riches_and_eve_moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/stock_tickers.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/us_foreclosures_graph_flashes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/wallstreet_montage.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/wallstreet_old.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/whatver.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/where_is_my_bailout.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/whodunnit.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/inside_job/whodunnit2.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/camp_3_sign.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/camp_shot.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/cigarettes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/followin_busienessman.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/food.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/library.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/media1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/medicals1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/medicals2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/moar_food.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/moar_media_3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/music.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/Occupation_ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/police.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/rapper_police_rise_up.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/signs_1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/wall_st.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_new_york_2011/who_is_there.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/all_the_people_masses.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/assemblies.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/cleaning the camp.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/committiees.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/even_moar_assemblies.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/even_more_ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/fast ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/fast_square.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/finished_with_the_crap.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/fuck_the_media.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/fun and camps.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/fun at the square.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/guilty.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/iets.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/life in the camp.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/masses.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/media.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/moar_assemblies.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/moar_food.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/moar_protest_people_signs.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/more_cleaning_camp.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/more_flagwaving_ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/more_then13_cities.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/never_seen_anything.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/peopl_at_sol_square.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/people_close_up.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/police violence.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/ppl_and_flowers.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/signs_and_peopl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/signs_and_so.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/silent arms.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/sleeping ppl.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/Spain city.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/spanish_signs.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/these are our arms.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/true_democracy_now.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/occupy_spain_may_2011/we are not afraid.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/lost_my_job_found_an_occupation.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/round_shot.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/set1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/set2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/set3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/set4.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/protest_signs/set5_w_ppl.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/cant_afford_a_lobbyist.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/carlin.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/chomsky.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/corperations_are_not_people.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/goethe.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/keep_shopping.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/mad_as_hell.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/media_is_like_the_weather.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/Michio Kaku.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/occupytogether.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/occupywallstreet.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/the people.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/quotes/we_are_the_99.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/3d_fractal.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/3d_fractal2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/arial fractal 3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/arial fractal moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/arial fractal.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/birds.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/blood vessels.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/bouncing 2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/bouncing 3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/bouncing 4.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/bouncing guys.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/butterfly.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/cells and stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/Cells.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/chaos.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/city.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwoek2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork 5.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork and space.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork and stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork butterfly.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork_industry.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/clockwork3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/collage.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/computer cells animal people.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/computer1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/dunes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/eicel moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/eicel2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/even_moar_cellies.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/feedback.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/feedback2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/fighting cells and space.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/formula.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/formula2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/fractal everywhere.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/gnoes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/growin cells 2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/growing_cells.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/human_close.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/leafs.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/mandelbrot 2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/mandelbrot fomula.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/mandelbrot set.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/mixup.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/moar computer.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/more bouncing.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/more cells and stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/more_cells_moar.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/mountains.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/natureschaos.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/notes2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/petridish.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/petridish_blue.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/petridish2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/petridish3.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/petridish4.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/plants.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/space and stuff.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/spacey1.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/storms_and_chaos.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/street city computer.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/trippy formulas.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/trippy space.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/trippyspace2.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/vlekken.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/secret_life_of_chaos/zebra and giraffe.mp4",

      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/aarde_rondjes.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/blues.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/fractolcloud.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/red_blues.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/rondje_aarde_fractol.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/title.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/xangavision.mp4",
      "http://cdn.marduq.tv/veejay/occupy_chaos/title_credits_and_hues/yellow_greenish.mp4"
      ]

    // through cloudfront
    var notv = [
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_01_0.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_01_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_02_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_03_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_04_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_05_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_06_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_07_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_08_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_09_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_10_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_11_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_12_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_13_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_14_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_15_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_16_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_17_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_18_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_19_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_20_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_21_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_22_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_23_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_24_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_25_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_26_1.mp4",
      "http://cdn.marduq.tv/veejay/NoTV2/VTS_27_1.mp4"
    ]

    //var notv = null
    //$.get('/set/notv', function(d) { notv = JSON.parse(d) })

    console.log("SOURCE")
    var source = notv[ Math.floor( Math.random() * notv.length) ];
    //var source = occupy_chaos[ Math.floor( Math.random() * occupy_chaos.length) ];

    //var source = _self.getSrcByQuality( program )
    _self.setSrc( source );

    /*
    if (Math.random() > 0.5 ) {
      _self.getSrcByTags(["awesome"])
    }else{
      _self.getSrcByTags(["runner"])
    }
    */
  }

  // for old times sake,
  _self.changez = function( _tag ){
    _self.change( _tag )
  }

  // get the version by it's quality ( marduq asset library )
  _self.getSrcByQuality = function( _program, _quality ) {
    if ( _quality == undefined ) _quality = "720p_h264"
    var match = null
    _program.assets.versions.forEach( function(version) {
      if ( version.label == _quality ) match = version
    })
    return match.url;
  }
}
