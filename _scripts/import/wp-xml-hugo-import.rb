# -*- coding: utf-8 -*-
# $ ruby wp-xml-hugo-import.rb ***.wordpress.yyyy-mm-dd.xml

require 'fileutils'
require 'time'
require 'rexml/document'
require 'html2markdown'
require 'Upmark'
include REXML

class Time
  def timezone(timezone = 'UTC')
    old = ENV['TZ']
    utc = self.dup.utc
    ENV['TZ'] = timezone
    output = utc.localtime
    ENV['TZ'] = old
    output
  end
end

doc = Document.new File.new(ARGV[0])
FileUtils.mkdir_p 'post'
FileUtils.mkdir_p 'page'
images = Document.new File.new(ARGV[1])

doc.elements.each("rss/channel/item[wp:status = 'publish' and (wp:post_type = 'post' or wp:post_type = 'page')]") do |e|
  post = e.elements

  post_id   = post['wp:post_id'].text
  post_name = post['wp:post_name'].text
  post_type = post['wp:post_type'].text
  post_date = Time.parse(post['wp:post_date'].text)
  post_date.timezone('Europe/Brussels')

  title     = post['title'].text
  content   = post['content:encoded'].text
  category  = ''
  tags  = ''
  thumbnail_id = ''
  thumbnail = ''
  recette_qty = ''
  recette_temps = ''
  recette_ingredients = ''

  post.each('wp:postmeta') do |meta|
    case meta.elements['wp:meta_key'].text
      when "_thumbnail_id" then
        thumbnail_id = meta.elements['wp:meta_value'].text
      when "wpcf-ingredient_qty" then
        recette_qty = meta.elements['wp:meta_value'].text.gsub(/&nbsp;/i, "")
      when "wpcf-ingredient_temps" then
        recette_temps = meta.elements['wp:meta_value'].text.gsub(/&nbsp;/i, "")
      when "wpcf-ingredient-textarea" then
        value = meta.elements['wp:meta_value'].text.gsub(/&nbsp;/i, "")
        recette_ingredients = "\"#{Upmark.convert(value)}\""
    end
  end

  images.elements.each("rss/channel/item[wp:post_id = #{thumbnail_id}]") do |img|
    thumbnail = img.elements['wp:attachment_url'].text.gsub(/((http|https):\/\/)*?(www.)*?crokmou.com\/wp-content\/uploads\/(\d+)\/(\d+)\/(.+?)/, 'https://crokmou.com/images/\4/\5/\6')
  end

  post.each('category') do |c|
    case c.attributes['domain']
      when "category" then
        category = "#{category}  - \"#{c.text.capitalize}\"\n"
      when "post_tag" then
        tags = "#{tags}  - \"#{c.text.capitalize}\"\n"
    end
  end

  content = content.gsub(/src="((http|https):\/\/)*?(www.)*?crokmou.com\/wp-content\/uploads\/(\d+)\/(\d+)\/(.+?)"/, 'src="https://crokmou.com/images/\6"')

  year = post_date.year
  month = post_date.month
  day = post_date.day
  filename = "#{year}-#{month < 10 ? "0" : ""}#{month}-#{day < 10 ? "0" : ""}#{day}-#{(post_name ? post_name : post_id)}.md"
  puts "Converting: #{filename}"

  content = content.gsub(/&nbsp;/i, "")
  File.open("#{post_type}/#{filename}", 'w') do |f|
    f.puts '---'
    f.puts "date: \"#{post_date.strftime("%Y-%m-%dT%H:%M:%S%:z")}\""
    f.puts "title: \"#{title}\""
    f.puts "thumbnail: \"#{thumbnail}\""
    f.puts "categories:\n#{category}"
    f.puts "tags:\n#{tags}"
    if defined?(recette_qty) && (recette_qty != '')
      f.puts "recette_qty: #{recette_qty}"
    end
    if defined?(recette_temps) && (recette_temps != '')
      f.puts "recette_temps: #{recette_temps}"
    end
    if defined?(recette_ingredients) && (recette_ingredients != '')
      f.puts "recette_ingredients: #{recette_ingredients}"
    end
    f.puts "slug: \"#{(post_name ? post_name : post_id)}\""
    f.puts '---'
    f.puts "\n"
    f.puts content
  end

end